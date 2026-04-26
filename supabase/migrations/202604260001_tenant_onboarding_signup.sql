-- Tenant onboarding flag + self-serve signup (email, nama, HP) → shohibul tanpa tenant
-- Hanya admin_masjid / super_admin yang boleh update baris tenant (data masjid).

alter table public.tenants
  add column if not exists onboarding_profile_complete boolean not null default false;

-- Jangan ganggu tenant yang sudah ada di produksi: anggap sudah lengkap.
update public.tenants set onboarding_profile_complete = true where onboarding_profile_complete is distinct from true;

-- Allow admin masjid & super_admin to update their / any tenant row (RLS).
drop policy if exists "tenants_update_by_admin" on public.tenants;
create policy "tenants_update_by_admin" on public.tenants
for update using (
  public.current_role() = 'super_admin'
  or (
    public.current_role() = 'admin_masjid'
    and id = public.current_tenant_id()
  )
)
with check (
  public.current_role() = 'super_admin'
  or (
    public.current_role() = 'admin_masjid'
    and id = public.current_tenant_id()
  )
);

-- Signup: cukup nama + HP di metadata user. Tanpa tenant baru; role shohibul.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full_name text;
  v_phone text;
begin
  v_full_name := coalesce(new.raw_user_meta_data->>'full_name', null);
  v_phone := coalesce(new.raw_user_meta_data->>'phone', null);

  insert into public.profiles(
    user_id,
    tenant_id,
    role,
    full_name,
    phone,
    mosque_position,
    address,
    location_full
  )
  values (
    new.id,
    null,
    'shohibul',
    nullif(trim(coalesce(v_full_name, '')), ''),
    nullif(trim(coalesce(v_phone, '')), ''),
    null,
    null,
    null
  )
  on conflict (user_id) do update set
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    phone = coalesce(excluded.phone, public.profiles.phone);

  return new;
end;
$$;
