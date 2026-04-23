-- Qurbanesia: initial schema (tenant + qurban core)
-- This migration is intended for Supabase Postgres.

-- Extensions
create extension if not exists "uuid-ossp";

-- Helpers (current user context)
create or replace function public.current_user_id()
returns uuid
language sql
stable
as $$
  select auth.uid();
$$;

create table if not exists public.tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  location text,
  logo_url text,
  plan text not null default 'free',
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete set null,
  role text not null check (role in ('super_admin','admin_masjid','panitia','shohibul','jagal','supplier','penerima')),
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

create or replace function public.current_tenant_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select p.tenant_id from public.profiles p where p.user_id = auth.uid();
$$;

create or replace function public.current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.role from public.profiles p where p.user_id = auth.uid();
$$;

-- Suppliers & marketplace animals
create table if not exists public.suppliers (
  id uuid primary key default uuid_generate_v4(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  location text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.supplier_animals (
  id uuid primary key default uuid_generate_v4(),
  supplier_id uuid not null references public.suppliers(id) on delete cascade,
  type text not null check (type in ('sapi','kambing','domba')),
  breed text,
  weight_kg numeric,
  age_years numeric,
  grade text not null check (grade in ('ekonomi','standar','premium')),
  price_idr bigint not null,
  status text not null check (status in ('available','booked','sold','delivered')) default 'available',
  health_cert_path text,
  photos jsonb not null default '[]'::jsonb,
  video_url text,
  created_at timestamptz not null default now()
);

-- Orders (tenant buys from supplier)
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  status text not null check (status in ('draft','submitted','paid','preparing','shipping','arrived','cancelled')) default 'draft',
  total_price_idr bigint not null default 0,
  paid_amount_idr bigint not null default 0,
  escrow_status text not null check (escrow_status in ('held','released','disputed')) default 'held',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  supplier_animal_id uuid not null references public.supplier_animals(id) on delete restrict,
  quantity int not null default 1 check (quantity > 0),
  price_idr bigint not null
);

-- Animals owned by tenant (result of orders or manual input)
create table if not exists public.animals (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null, -- e.g. S-001
  name text,
  type text not null check (type in ('sapi','kambing','domba')),
  breed text,
  weight_label text,
  age_label text,
  status text not null check (status in (
    'terdaftar','dp','cicilan','lunas',
    'hewan_terkonfirmasi','di_kandang','estimasi_sembelih','sedang_disembelih',
    'proses_daging','dikemas','siap_kirim','selesai'
  )) default 'terdaftar',
  photo_path text,
  source text,
  max_capacity int not null default 7 check (max_capacity between 1 and 7),
  created_at timestamptz not null default now(),
  unique (tenant_id, code)
);

-- Shohibul registrations (tenant-scoped)
create table if not exists public.shohibuls (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null, -- optional when shohibul has login
  code text not null, -- e.g. SH-001
  name text not null,
  phone text not null,
  email text,
  address text,
  qurban_type text not null check (qurban_type in ('sapi_1_7','kambing','domba')),
  grade text not null check (grade in ('ekonomi','standar','premium')),
  niat text,
  delivery_pref text not null check (delivery_pref in ('ambil_sendiri','antar')) default 'ambil_sendiri',
  wants_offal boolean not null default true,
  wants_skin boolean not null default false,
  status text not null check (status in ('terdaftar','dp','cicilan','lunas')) default 'terdaftar',
  total_amount_idr bigint not null default 0,
  paid_amount_idr bigint not null default 0,
  registered_at timestamptz not null default now(),
  unique (tenant_id, code)
);

create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  shohibul_id uuid not null references public.shohibuls(id) on delete cascade,
  amount_idr bigint not null check (amount_idr > 0),
  method text,
  proof_path text,
  paid_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- Many-to-many: animal participants
create table if not exists public.animal_participants (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  animal_id uuid not null references public.animals(id) on delete cascade,
  shohibul_id uuid not null references public.shohibuls(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (animal_id, shohibul_id)
);

-- Capacity enforcement trigger
create or replace function public.enforce_animal_capacity()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_count int;
  cap int;
begin
  select count(*) into current_count from public.animal_participants ap where ap.animal_id = new.animal_id;
  select a.max_capacity into cap from public.animals a where a.id = new.animal_id;
  if cap is null then
    raise exception 'Animal not found';
  end if;
  if current_count >= cap then
    raise exception 'Animal capacity exceeded';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_animal_capacity on public.animal_participants;
create trigger trg_enforce_animal_capacity
before insert on public.animal_participants
for each row execute function public.enforce_animal_capacity();

-- Qurban cases (unit tracking; typically 1 per shohibul registration)
create table if not exists public.qurban_cases (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  shohibul_id uuid not null references public.shohibuls(id) on delete cascade,
  animal_id uuid references public.animals(id) on delete set null,
  status text not null check (status in (
    'terdaftar','dp','cicilan','lunas',
    'hewan_terkonfirmasi','di_kandang','estimasi_sembelih','sedang_disembelih',
    'proses_daging','dikemas','siap_kirim','selesai'
  )) default 'terdaftar',
  last_updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.tracking_events (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  qurban_case_id uuid not null references public.qurban_cases(id) on delete cascade,
  status text not null,
  message text,
  occurred_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  meta jsonb not null default '{}'::jsonb
);

create table if not exists public.media_assets (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  qurban_case_id uuid references public.qurban_cases(id) on delete cascade,
  animal_id uuid references public.animals(id) on delete cascade,
  stage text,
  type text not null check (type in ('photo','video','certificate','proof','other')) default 'photo',
  storage_bucket text not null,
  storage_path text not null,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- Distribution
create table if not exists public.distribution_configs (
  tenant_id uuid primary key references public.tenants(id) on delete cascade,
  bag_weight_kg numeric not null default 1.5,
  shohibul_meat_kg numeric not null default 2.0,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create table if not exists public.animal_yields (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  animal_id uuid not null references public.animals(id) on delete cascade,
  meat_weight_kg numeric not null default 0,
  offal_weight_kg numeric not null default 0,
  bone_weight_kg numeric not null default 0,
  total_bags int not null default 0,
  shohibul_bags int not null default 0,
  mustahik_bags int not null default 0,
  distributed_bags int not null default 0,
  status text not null check (status in ('pending','packed','distributed')) default 'pending',
  updated_at timestamptz not null default now(),
  unique (tenant_id, animal_id)
);

create table if not exists public.mustahiks (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  phone text,
  nik text not null,
  address text,
  zone text,
  category text,
  family_count int not null default 1,
  allocation_bags int not null default 1,
  status text not null check (status in ('registered','verified','queued','shipped','received')) default 'registered',
  delivery_method text not null check (delivery_method in ('pickup','delivery')) default 'pickup',
  driver_name text,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, code),
  unique (tenant_id, nik)
);

create table if not exists public.distributions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  animal_yield_id uuid references public.animal_yields(id) on delete set null,
  mustahik_id uuid references public.mustahiks(id) on delete set null,
  shohibul_id uuid references public.shohibuls(id) on delete set null,
  package_code text not null,
  bags int not null default 1,
  status text not null check (status in ('queued','shipped','received')) default 'queued',
  driver_name text,
  driver_phone text,
  shipped_at timestamptz,
  received_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, package_code)
);

-- Notifications + gratitude
create table if not exists public.notification_templates (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  trigger text not null,
  channels text[] not null default array['email']::text[],
  message text not null,
  is_active boolean not null default true,
  variables text[] not null default '{}'::text[],
  created_at timestamptz not null default now()
);

create table if not exists public.notification_logs (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  recipient text not null,
  channel text not null,
  status text not null check (status in ('sent','delivered','read','failed')) default 'sent',
  message text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.gratitude_messages (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  from_name text not null,
  to_shohibul_id uuid references public.shohibuls(id) on delete set null,
  to_donatur_id uuid,
  message text not null,
  location text,
  created_at timestamptz not null default now()
);

-- Payment status trigger (keeps shohibul paid_amount_idr + status)
create or replace function public.recalculate_shohibul_payment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  sum_paid bigint;
  total bigint;
  new_status text;
begin
  select coalesce(sum(p.amount_idr),0) into sum_paid from public.payments p where p.shohibul_id = new.shohibul_id;
  select s.total_amount_idr into total from public.shohibuls s where s.id = new.shohibul_id;
  if total is null then
    return new;
  end if;

  if sum_paid <= 0 then
    new_status := 'terdaftar';
  elsif sum_paid < total then
    -- first payment treated as dp; subsequent = cicilan (simple heuristic)
    if (select count(*) from public.payments p where p.shohibul_id = new.shohibul_id) = 1 then
      new_status := 'dp';
    else
      new_status := 'cicilan';
    end if;
  else
    new_status := 'lunas';
  end if;

  update public.shohibuls
    set paid_amount_idr = sum_paid,
        status = new_status
  where id = new.shohibul_id;

  update public.qurban_cases
    set status = (select s.status from public.shohibuls s where s.id = new.shohibul_id),
        last_updated_at = now()
  where shohibul_id = new.shohibul_id;

  return new;
end;
$$;

drop trigger if exists trg_recalculate_shohibul_payment on public.payments;
create trigger trg_recalculate_shohibul_payment
after insert on public.payments
for each row execute function public.recalculate_shohibul_payment();

-- RLS
alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.suppliers enable row level security;
alter table public.supplier_animals enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.animals enable row level security;
alter table public.shohibuls enable row level security;
alter table public.payments enable row level security;
alter table public.animal_participants enable row level security;
alter table public.qurban_cases enable row level security;
alter table public.tracking_events enable row level security;
alter table public.media_assets enable row level security;
alter table public.distribution_configs enable row level security;
alter table public.animal_yields enable row level security;
alter table public.mustahiks enable row level security;
alter table public.distributions enable row level security;
alter table public.notification_templates enable row level security;
alter table public.notification_logs enable row level security;
alter table public.gratitude_messages enable row level security;

-- Policies
-- Tenants: super_admin can read all; tenant members can read their tenant row
create policy "tenants_read_own" on public.tenants
for select using (
  public.current_role() = 'super_admin'
  or id = public.current_tenant_id()
);

-- Profiles: user can read/update their own; super_admin can read all
create policy "profiles_read_own" on public.profiles
for select using (public.current_role() = 'super_admin' or user_id = auth.uid());

create policy "profiles_update_own" on public.profiles
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Generic tenant-scoped read/write helpers (repeat per table)
create policy "animals_tenant_rw" on public.animals
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "shohibuls_tenant_rw" on public.shohibuls
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "payments_tenant_rw" on public.payments
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "animal_participants_tenant_rw" on public.animal_participants
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "qurban_cases_tenant_rw" on public.qurban_cases
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "tracking_events_tenant_rw" on public.tracking_events
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "media_assets_tenant_rw" on public.media_assets
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "distribution_configs_tenant_rw" on public.distribution_configs
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "animal_yields_tenant_rw" on public.animal_yields
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "mustahiks_tenant_rw" on public.mustahiks
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "distributions_tenant_rw" on public.distributions
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "notification_templates_tenant_rw" on public.notification_templates
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "notification_logs_tenant_rw" on public.notification_logs
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "gratitude_messages_tenant_rw" on public.gratitude_messages
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

-- Suppliers / marketplace: supplier owners manage their supplier; tenants can read available animals
create policy "suppliers_owner_rw" on public.suppliers
for all using (owner_user_id = auth.uid() or public.current_role() = 'super_admin')
with check (owner_user_id = auth.uid() or public.current_role() = 'super_admin');

create policy "supplier_animals_read_all_available" on public.supplier_animals
for select using (true);

create policy "supplier_animals_owner_rw" on public.supplier_animals
for insert with check (
  exists (
    select 1 from public.suppliers s
    where s.id = supplier_animals.supplier_id
      and s.owner_user_id = auth.uid()
  )
);
create policy "supplier_animals_owner_update" on public.supplier_animals
for update using (
  exists (
    select 1 from public.suppliers s
    where s.id = supplier_animals.supplier_id
      and s.owner_user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.suppliers s
    where s.id = supplier_animals.supplier_id
      and s.owner_user_id = auth.uid()
  )
);

create policy "orders_tenant_rw" on public.orders
for all using (tenant_id = public.current_tenant_id())
with check (tenant_id = public.current_tenant_id());

create policy "order_items_via_order" on public.order_items
for all using (
  exists (select 1 from public.orders o where o.id = order_items.order_id and o.tenant_id = public.current_tenant_id())
) with check (
  exists (select 1 from public.orders o where o.id = order_items.order_id and o.tenant_id = public.current_tenant_id())
);

