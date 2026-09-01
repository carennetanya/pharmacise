-- Cashier POS backend: inventory, sales, and an atomic checkout RPC.

create table if not exists public.inventory_items (
  id            uuid primary key default gen_random_uuid(),
  pharmacy_id   uuid not null references public.pharmacies(id) on delete cascade,
  name          text not null,
  batch         text not null,
  category      text not null default 'Umum',
  expiry_date   date,
  stock         integer not null default 0 check (stock >= 0),
  unit          text not null default 'Strip',
  price         numeric(12, 2) not null default 0 check (price >= 0),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (pharmacy_id, batch)
);

create table if not exists public.sales_transactions (
  id              uuid primary key default gen_random_uuid(),
  pharmacy_id     uuid not null references public.pharmacies(id) on delete cascade,
  cashier_id      uuid references public.pharmacy_staff(id) on delete set null,
  created_by      uuid not null references auth.users(id) on delete restrict,
  patient_name    text not null default '',
  payment_method  text not null check (payment_method in ('cash', 'qris', 'debit', 'card')),
  subtotal        numeric(12, 2) not null check (subtotal >= 0),
  discount        numeric(12, 2) not null default 0 check (discount >= 0),
  tax             numeric(12, 2) not null default 0 check (tax >= 0),
  total           numeric(12, 2) not null check (total >= 0),
  created_at      timestamptz not null default now()
);

create table if not exists public.sale_items (
  id             uuid primary key default gen_random_uuid(),
  transaction_id  uuid not null references public.sales_transactions(id) on delete cascade,
  inventory_id    uuid not null references public.inventory_items(id),
  name           text not null,
  batch          text not null,
  quantity       integer not null check (quantity > 0),
  unit_price     numeric(12, 2) not null check (unit_price >= 0),
  line_total     numeric(12, 2) not null check (line_total >= 0)
);

create index if not exists inventory_items_pharmacy_idx on public.inventory_items(pharmacy_id);
create index if not exists sales_transactions_pharmacy_date_idx on public.sales_transactions(pharmacy_id, created_at desc);
create index if not exists sale_items_transaction_idx on public.sale_items(transaction_id);

create or replace function public.is_pharmacy_member(p_pharmacy_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.pharmacies p
    where p.id = p_pharmacy_id and p.owner_id = auth.uid()
  )
  or exists (
    select 1 from public.pharmacy_staff s
    where s.pharmacy_id = p_pharmacy_id
      and s.auth_user_id = auth.uid()
      and s.status = 'active'
  );
$$;

revoke execute on function public.is_pharmacy_member(uuid) from public;
grant execute on function public.is_pharmacy_member(uuid) to authenticated;

-- Keep the same updated_at behavior as the existing settings tables.
drop trigger if exists trg_inventory_items_updated_at on public.inventory_items;
create trigger trg_inventory_items_updated_at
  before update on public.inventory_items
  for each row execute function public.set_updated_at();

alter table public.inventory_items enable row level security;
alter table public.sales_transactions enable row level security;
alter table public.sale_items enable row level security;

drop policy if exists "inventory_select_member" on public.inventory_items;
create policy "inventory_select_member" on public.inventory_items
  for select using (public.is_pharmacy_member(pharmacy_id));

drop policy if exists "inventory_manage_owner" on public.inventory_items;
create policy "inventory_manage_owner" on public.inventory_items
  for all using (
    exists (select 1 from public.pharmacies p where p.id = pharmacy_id and p.owner_id = auth.uid())
  ) with check (
    exists (select 1 from public.pharmacies p where p.id = pharmacy_id and p.owner_id = auth.uid())
  );

drop policy if exists "sales_select_member" on public.sales_transactions;
create policy "sales_select_member" on public.sales_transactions
  for select using (public.is_pharmacy_member(pharmacy_id));

drop policy if exists "sale_items_select_member" on public.sale_items;
create policy "sale_items_select_member" on public.sale_items
  for select using (
    exists (
      select 1 from public.sales_transactions t
      where t.id = transaction_id and public.is_pharmacy_member(t.pharmacy_id)
    )
  );

drop policy if exists "pharmacy_staff_select_self" on public.pharmacy_staff;
create policy "pharmacy_staff_select_self" on public.pharmacy_staff
  for select using (auth_user_id = auth.uid() and status = 'active');

-- Staff identity is readable for role resolution, but its password/PIN hash is not.
revoke select (pin_hash) on public.pharmacy_staff from authenticated;

create or replace function public.get_my_staff_access()
returns table (
  staff_id uuid,
  pharmacy_id uuid,
  staff_name text,
  staff_email text,
  staff_phone text,
  staff_role text,
  staff_status text,
  auth_user_id uuid,
  pharmacy_name text,
  pharmacy_owner_id uuid
)
language sql
stable
security definer
set search_path = public
as $$
  select
    s.id,
    s.pharmacy_id,
    s.name,
    s.email,
    s.phone,
    s.role,
    s.status,
    s.auth_user_id,
    p.name,
    p.owner_id
  from public.pharmacy_staff s
  join public.pharmacies p on p.id = s.pharmacy_id
  where s.status = 'active'
    and (
      s.auth_user_id = auth.uid()
      or lower(s.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  order by s.created_at desc
  limit 1;
$$;

revoke execute on function public.get_my_staff_access() from public;
grant execute on function public.get_my_staff_access() to authenticated;

-- Client code cannot insert sales directly; checkout must validate and update stock atomically.
revoke insert, update, delete on public.sales_transactions from authenticated;
revoke insert, update, delete on public.sale_items from authenticated;

create or replace function public.checkout_sale(
  p_pharmacy_id    uuid,
  p_items          jsonb,
  p_payment_method text,
  p_discount       numeric default 0,
  p_tax            numeric default 0,
  p_patient_name   text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_transaction public.sales_transactions;
  v_inventory public.inventory_items;
  v_item jsonb;
  v_inventory_id uuid;
  v_quantity integer;
  v_subtotal numeric := 0;
  v_discount numeric := greatest(coalesce(p_discount, 0), 0);
  v_tax numeric := greatest(coalesce(p_tax, 0), 0);
  v_total numeric;
  v_cashier_id uuid;
begin
  if not public.is_pharmacy_member(p_pharmacy_id) then
    raise exception 'Not authorized for this pharmacy';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'At least one sale item is required';
  end if;

  if p_payment_method not in ('cash', 'qris', 'debit', 'card') then
    raise exception 'Unsupported payment method';
  end if;

  select s.id into v_cashier_id
  from public.pharmacy_staff s
  where s.pharmacy_id = p_pharmacy_id
    and s.auth_user_id = auth.uid()
    and s.role = 'Cashier'
    and s.status = 'active'
  limit 1;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_inventory_id := (v_item->>'inventory_id')::uuid;
    v_quantity := (v_item->>'quantity')::integer;

    if v_quantity is null or v_quantity <= 0 then
      raise exception 'Quantity must be greater than zero';
    end if;

    select * into v_inventory
    from public.inventory_items
    where id = v_inventory_id and pharmacy_id = p_pharmacy_id
    for update;

    if not found then
      raise exception 'Inventory item not found';
    end if;

    if v_inventory.stock < v_quantity then
      raise exception 'Insufficient stock for %', v_inventory.name;
    end if;

    v_subtotal := v_subtotal + (v_inventory.price * v_quantity);
  end loop;

  if v_discount > v_subtotal then
    raise exception 'Discount cannot exceed subtotal';
  end if;

  v_total := v_subtotal - v_discount + v_tax;

  insert into public.sales_transactions (
    pharmacy_id, cashier_id, created_by, patient_name, payment_method,
    subtotal, discount, tax, total
  ) values (
    p_pharmacy_id, v_cashier_id, auth.uid(), coalesce(p_patient_name, ''),
    p_payment_method, v_subtotal, v_discount, v_tax, v_total
  ) returning * into v_transaction;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_inventory_id := (v_item->>'inventory_id')::uuid;
    v_quantity := (v_item->>'quantity')::integer;

    select * into v_inventory
    from public.inventory_items
    where id = v_inventory_id and pharmacy_id = p_pharmacy_id
    for update;

    insert into public.sale_items (
      transaction_id, inventory_id, name, batch, quantity, unit_price, line_total
    ) values (
      v_transaction.id, v_inventory.id, v_inventory.name, v_inventory.batch,
      v_quantity, v_inventory.price, v_inventory.price * v_quantity
    );

    update public.inventory_items
    set stock = stock - v_quantity
    where id = v_inventory.id;
  end loop;

  return jsonb_build_object(
    'id', v_transaction.id,
    'pharmacy_id', v_transaction.pharmacy_id,
    'subtotal', v_transaction.subtotal,
    'discount', v_transaction.discount,
    'tax', v_transaction.tax,
    'total', v_transaction.total,
    'payment_method', v_transaction.payment_method,
    'created_at', v_transaction.created_at
  );
end;
$$;

revoke execute on function public.checkout_sale(uuid, jsonb, text, numeric, numeric, text) from public;
grant execute on function public.checkout_sale(uuid, jsonb, text, numeric, numeric, text) to authenticated;
