-- Authentication activity audit log for staff and cashier accounts.

create table if not exists public.auth_activity_logs (
  id          uuid primary key default gen_random_uuid(),
  pharmacy_id uuid not null references public.pharmacies(id) on delete cascade,
  staff_id    uuid not null references public.pharmacy_staff(id) on delete cascade,
  user_id     uuid not null references auth.users(id) on delete cascade,
  action      text not null check (action in ('login', 'logout')),
  created_at  timestamptz not null default now()
);

create index if not exists auth_activity_logs_pharmacy_date_idx
  on public.auth_activity_logs(pharmacy_id, created_at desc);

alter table public.auth_activity_logs enable row level security;

create or replace function public.record_auth_activity(p_action text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_staff public.pharmacy_staff;
begin
  if p_action not in ('login', 'logout') then
    raise exception 'Unsupported auth activity';
  end if;

  select * into v_staff
  from public.pharmacy_staff
  where auth_user_id = auth.uid() and status = 'active'
  order by created_at desc
  limit 1;

  if v_staff.id is null then
    return;
  end if;

  insert into public.auth_activity_logs (pharmacy_id, staff_id, user_id, action)
  values (v_staff.pharmacy_id, v_staff.id, auth.uid(), p_action);
end;
$$;

create or replace function public.get_auth_activity_logs(p_limit integer default 100)
returns table (
  id uuid,
  staff_id uuid,
  staff_name text,
  staff_email text,
  staff_role text,
  action text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select l.id, l.staff_id, s.name, s.email, s.role, l.action, l.created_at
  from public.auth_activity_logs l
  join public.pharmacy_staff s on s.id = l.staff_id
  join public.pharmacies p on p.id = l.pharmacy_id
  where p.owner_id = auth.uid()
  order by l.created_at desc
  limit greatest(1, least(coalesce(p_limit, 100), 500));
$$;

revoke all on public.auth_activity_logs from anon, authenticated;
revoke execute on function public.record_auth_activity(text) from public;
revoke execute on function public.get_auth_activity_logs(integer) from public;
grant execute on function public.record_auth_activity(text) to authenticated;
grant execute on function public.get_auth_activity_logs(integer) to authenticated;
