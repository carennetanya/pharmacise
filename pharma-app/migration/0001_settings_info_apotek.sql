-- ============================================================================
-- Pharmacise — "Info Apotek" backend (pharmacy profile + staff/cashier access)
-- Run this in the Supabase SQL editor, or via `supabase db push`.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. pharmacies — one row per owner/pharmacist account
-- ----------------------------------------------------------------------------
create table if not exists public.pharmacies (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  name            text not null default '',
  phone           text default '',
  license_number  text default '',
  email           text default '',
  address         text default '',
  logo_url        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (owner_id)
);

comment on table public.pharmacies is 'One pharmacy profile per owner account (Info Apotek tab).';

-- ----------------------------------------------------------------------------
-- 2. pharmacy_staff — staff & cashier accounts belonging to a pharmacy
-- ----------------------------------------------------------------------------
create table if not exists public.pharmacy_staff (
  id            uuid primary key default gen_random_uuid(),
  pharmacy_id   uuid not null references public.pharmacies(id) on delete cascade,
  name          text not null,
  email         text not null,
  phone         text default '',
  role          text not null check (role in ('Staff', 'Cashier')),
  status        text not null default 'active' check (status in ('active', 'inactive')),
  pin_hash      text, -- bcrypt hash of the 4-digit POS PIN, never store/return plaintext
  auth_user_id  uuid references auth.users(id) on delete set null, -- optional, if the staff member also gets a Supabase Auth login
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (pharmacy_id, email)
);

comment on table public.pharmacy_staff is 'Staff / cashier rows managed from the Info Apotek tab.';

-- ----------------------------------------------------------------------------
-- 3. updated_at triggers
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_pharmacies_updated_at on public.pharmacies;
create trigger trg_pharmacies_updated_at
  before update on public.pharmacies
  for each row execute function public.set_updated_at();

drop trigger if exists trg_pharmacy_staff_updated_at on public.pharmacy_staff;
create trigger trg_pharmacy_staff_updated_at
  before update on public.pharmacy_staff
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 4. Row Level Security
-- ----------------------------------------------------------------------------
alter table public.pharmacies enable row level security;
alter table public.pharmacy_staff enable row level security;

-- Owners can fully manage their own pharmacy row.
drop policy if exists "pharmacies_select_own" on public.pharmacies;
create policy "pharmacies_select_own" on public.pharmacies
  for select using (owner_id = auth.uid());

drop policy if exists "pharmacies_insert_own" on public.pharmacies;
create policy "pharmacies_insert_own" on public.pharmacies
  for insert with check (owner_id = auth.uid());

drop policy if exists "pharmacies_update_own" on public.pharmacies;
create policy "pharmacies_update_own" on public.pharmacies
  for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- Staff rows are visible/editable only to the owner of the parent pharmacy.
-- Note: there is deliberately NO insert policy here — new staff must go
-- through the add_pharmacy_staff() RPC below so the PIN gets hashed
-- server-side and is never sent to the client in plaintext.
drop policy if exists "pharmacy_staff_select_owner" on public.pharmacy_staff;
create policy "pharmacy_staff_select_owner" on public.pharmacy_staff
  for select using (
    exists (
      select 1 from public.pharmacies p
      where p.id = pharmacy_staff.pharmacy_id
        and p.owner_id = auth.uid()
    )
  );

drop policy if exists "pharmacy_staff_update_owner" on public.pharmacy_staff;
create policy "pharmacy_staff_update_owner" on public.pharmacy_staff
  for update using (
    exists (
      select 1 from public.pharmacies p
      where p.id = pharmacy_staff.pharmacy_id
        and p.owner_id = auth.uid()
    )
  );

drop policy if exists "pharmacy_staff_delete_owner" on public.pharmacy_staff;
create policy "pharmacy_staff_delete_owner" on public.pharmacy_staff
  for delete using (
    exists (
      select 1 from public.pharmacies p
      where p.id = pharmacy_staff.pharmacy_id
        and p.owner_id = auth.uid()
    )
  );

-- Client updates should never be able to touch pin_hash directly.
revoke update (pin_hash) on public.pharmacy_staff from authenticated;

-- ----------------------------------------------------------------------------
-- 5. RPCs — the only way to create a staff row or change a PIN
-- ----------------------------------------------------------------------------
create or replace function public.add_pharmacy_staff(
  p_pharmacy_id uuid,
  p_name        text,
  p_email       text,
  p_phone       text,
  p_role        text,
  p_pin         text
)
returns public.pharmacy_staff
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.pharmacy_staff;
begin
  if not exists (
    select 1 from public.pharmacies
    where id = p_pharmacy_id and owner_id = auth.uid()
  ) then
    raise exception 'Not authorized to add staff to this pharmacy';
  end if;

  if p_pin is null or length(p_pin) <> 4 or p_pin !~ '^[0-9]{4}$' then
    raise exception 'PIN must be exactly 4 digits';
  end if;

  insert into public.pharmacy_staff (pharmacy_id, name, email, phone, role, pin_hash, status)
  values (p_pharmacy_id, p_name, p_email, p_phone, p_role, crypt(p_pin, gen_salt('bf')), 'active')
  returning * into v_row;

  return v_row;
end;
$$;

create or replace function public.set_staff_pin(
  p_staff_id uuid,
  p_pin      text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.pharmacy_staff s
    join public.pharmacies p on p.id = s.pharmacy_id
    where s.id = p_staff_id and p.owner_id = auth.uid()
  ) then
    raise exception 'Not authorized to change this PIN';
  end if;

  if p_pin is null or length(p_pin) <> 4 or p_pin !~ '^[0-9]{4}$' then
    raise exception 'PIN must be exactly 4 digits';
  end if;

  update public.pharmacy_staff
  set pin_hash = crypt(p_pin, gen_salt('bf'))
  where id = p_staff_id;
end;
$$;

-- Optional: used by the POS/cashier login screen to verify a PIN without
-- ever exposing pin_hash to the client. Returns the staff row on success.
create or replace function public.verify_staff_pin(
  p_pharmacy_id uuid,
  p_email       text,
  p_pin         text
)
returns public.pharmacy_staff
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.pharmacy_staff;
begin
  select * into v_row
  from public.pharmacy_staff
  where pharmacy_id = p_pharmacy_id
    and email = p_email
    and status = 'active'
    and pin_hash = crypt(p_pin, pin_hash);

  if v_row.id is null then
    raise exception 'Invalid credentials';
  end if;

  return v_row;
end;
$$;

grant execute on function public.add_pharmacy_staff(uuid, text, text, text, text, text) to authenticated;
grant execute on function public.set_staff_pin(uuid, text) to authenticated;
grant execute on function public.verify_staff_pin(uuid, text, text) to authenticated, anon;

-- ----------------------------------------------------------------------------
-- 6. Storage bucket for pharmacy logos
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('pharmacy-logos', 'pharmacy-logos', true)
on conflict (id) do nothing;

drop policy if exists "pharmacy_logos_public_read" on storage.objects;
create policy "pharmacy_logos_public_read" on storage.objects
  for select using (bucket_id = 'pharmacy-logos');

-- Each owner may only write into a folder named after their own user id,
-- e.g. `${auth.uid()}/logo.png`.
drop policy if exists "pharmacy_logos_owner_write" on storage.objects;
create policy "pharmacy_logos_owner_write" on storage.objects
  for insert with check (
    bucket_id = 'pharmacy-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "pharmacy_logos_owner_update" on storage.objects;
create policy "pharmacy_logos_owner_update" on storage.objects
  for update using (
    bucket_id = 'pharmacy-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "pharmacy_logos_owner_delete" on storage.objects;
create policy "pharmacy_logos_owner_delete" on storage.objects
  for delete using (
    bucket_id = 'pharmacy-logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
