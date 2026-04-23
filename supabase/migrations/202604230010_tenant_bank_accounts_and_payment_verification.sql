-- Manual payments per-tenant bank accounts + verification workflow

create table if not exists public.tenant_bank_accounts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  bank_name text not null,
  account_number text not null,
  account_holder text not null,
  is_default boolean not null default false,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

create index if not exists tenant_bank_accounts_tenant_id_idx on public.tenant_bank_accounts(tenant_id);
create unique index if not exists tenant_bank_accounts_one_default_per_tenant
  on public.tenant_bank_accounts(tenant_id)
  where is_default is true;

alter table public.tenant_bank_accounts enable row level security;

-- Tenant scoped read for all tenant members; write only for admin_masjid & super_admin
create policy "tenant_bank_accounts_read_tenant" on public.tenant_bank_accounts
for select using (tenant_id = public.current_tenant_id() or public.current_role() = 'super_admin');

create policy "tenant_bank_accounts_write_admin" on public.tenant_bank_accounts
for insert with check (
  tenant_id = public.current_tenant_id()
  and public.current_role() in ('admin_masjid','super_admin')
);

create policy "tenant_bank_accounts_update_admin" on public.tenant_bank_accounts
for update using (
  tenant_id = public.current_tenant_id()
  and public.current_role() in ('admin_masjid','super_admin')
) with check (
  tenant_id = public.current_tenant_id()
  and public.current_role() in ('admin_masjid','super_admin')
);

create policy "tenant_bank_accounts_delete_admin" on public.tenant_bank_accounts
for delete using (
  tenant_id = public.current_tenant_id()
  and public.current_role() in ('admin_masjid','super_admin')
);

-- Payments verification fields
alter table public.payments
  add column if not exists status text not null default 'submitted' check (status in ('submitted','verified','rejected')),
  add column if not exists tenant_bank_account_id uuid references public.tenant_bank_accounts(id) on delete set null,
  add column if not exists payer_name text,
  add column if not exists transfer_at timestamptz,
  add column if not exists verified_by uuid references auth.users(id) on delete set null,
  add column if not exists verified_at timestamptz,
  add column if not exists reject_reason text;

-- Recalculate function: only VERIFIED counts towards paid_amount/status
create or replace function public.recalculate_shohibul_payment_verified()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  sid uuid;
  sum_paid bigint;
  total bigint;
  payment_count int;
  new_status text;
begin
  sid := coalesce(new.shohibul_id, old.shohibul_id);
  if sid is null then
    return coalesce(new, old);
  end if;

  select coalesce(sum(p.amount_idr),0), count(*)
    into sum_paid, payment_count
  from public.payments p
  where p.shohibul_id = sid
    and p.status = 'verified';

  select s.total_amount_idr into total from public.shohibuls s where s.id = sid;

  if total is null then
    return coalesce(new, old);
  end if;

  if sum_paid <= 0 then
    new_status := 'terdaftar';
  elsif sum_paid < total then
    new_status := case when payment_count = 1 then 'dp' else 'cicilan' end;
  else
    new_status := 'lunas';
  end if;

  update public.shohibuls
    set paid_amount_idr = sum_paid,
        status = new_status
  where id = sid;

  update public.qurban_cases
    set status = new_status,
        last_updated_at = now()
  where shohibul_id = sid;

  -- Optional: log event when payment status changes to verified/rejected
  if tg_op = 'UPDATE' and old.status is distinct from new.status then
    insert into public.tracking_events(tenant_id, qurban_case_id, status, message, occurred_at, created_by, meta)
    select
      qc.tenant_id,
      qc.id,
      case when new.status = 'verified' then 'payment_verified' else 'payment_rejected' end,
      case when new.status = 'verified' then 'Pembayaran terverifikasi oleh finance.' else coalesce('Pembayaran ditolak: ' || new.reject_reason, 'Pembayaran ditolak.') end,
      now(),
      auth.uid(),
      jsonb_build_object('payment_id', coalesce(new.id, old.id), 'new_status', new.status)
    from public.qurban_cases qc
    where qc.shohibul_id = sid
    limit 1;
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_recalculate_shohhibul_payment on public.payments;
drop trigger if exists trg_recalculate_shohibul_payment on public.payments;
drop trigger if exists trg_recalculate_shohibul_payment_verified on public.payments;

create trigger trg_recalculate_shohibul_payment_verified
after insert or update of status or delete on public.payments
for each row execute function public.recalculate_shohibul_payment_verified();

-- Tighten RLS for payments: remove overly permissive tenant-wide policy
drop policy if exists "payments_tenant_rw" on public.payments;

-- Read: any tenant member can read tenant payments (admin view), but shohibul UI should filter to own shohibul_id
create policy "payments_read_tenant" on public.payments
for select using (tenant_id = public.current_tenant_id());

-- Insert: admin_masjid can insert; shohibul can insert only for their own shohibul row (shohibuls.user_id = auth.uid())
create policy "payments_insert_admin_or_own" on public.payments
for insert with check (
  tenant_id = public.current_tenant_id()
  and (
    public.current_role() in ('admin_masjid','super_admin')
    or exists (
      select 1 from public.shohibuls s
      where s.id = payments.shohibul_id
        and s.user_id = auth.uid()
        and s.tenant_id = public.current_tenant_id()
    )
  )
);

-- Update: finance verifies/rejects; shohibul can only update their own submitted payment fields (proof/payer/transfer_at) while status=submitted
create policy "payments_update_finance" on public.payments
for update using (
  tenant_id = public.current_tenant_id()
  and public.current_role() in ('admin_masjid','super_admin')
) with check (
  tenant_id = public.current_tenant_id()
  and public.current_role() in ('admin_masjid','super_admin')
);

create policy "payments_update_own_submitted" on public.payments
for update using (
  tenant_id = public.current_tenant_id()
  and status = 'submitted'
  and exists (
    select 1 from public.shohibuls s
    where s.id = payments.shohibul_id
      and s.user_id = auth.uid()
      and s.tenant_id = public.current_tenant_id()
  )
) with check (
  tenant_id = public.current_tenant_id()
  and status = 'submitted'
  and exists (
    select 1 from public.shohibuls s
    where s.id = payments.shohibul_id
      and s.user_id = auth.uid()
      and s.tenant_id = public.current_tenant_id()
  )
);

