-- Auto-create tenant + profile on signup (auth.users insert).
-- This avoids client-side inserts that fail when email confirmation prevents a session.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_mosque_name text;
  v_location_full text;
  v_full_name text;
  v_phone text;
  v_address text;
  v_position text;
begin
  v_mosque_name := coalesce(new.raw_user_meta_data->>'mosque_name', null);
  v_location_full := coalesce(new.raw_user_meta_data->>'location_full', null);
  v_full_name := coalesce(new.raw_user_meta_data->>'full_name', null);
  v_phone := coalesce(new.raw_user_meta_data->>'phone', null);
  v_address := coalesce(new.raw_user_meta_data->>'address', null);
  v_position := coalesce(new.raw_user_meta_data->>'mosque_position', null);

  if v_mosque_name is not null and length(trim(v_mosque_name)) > 0 then
    insert into public.tenants(name, location)
    values (trim(v_mosque_name), nullif(trim(coalesce(v_location_full, '')), ''))
    returning id into v_tenant_id;
  else
    v_tenant_id := null;
  end if;

  insert into public.profiles(user_id, tenant_id, role, full_name, phone, mosque_position, address, location_full)
  values (
    new.id,
    v_tenant_id,
    case when v_tenant_id is null then 'shohibul' else 'admin_masjid' end,
    nullif(trim(coalesce(v_full_name, '')), ''),
    nullif(trim(coalesce(v_phone, '')), ''),
    nullif(trim(coalesce(v_position, '')), ''),
    nullif(trim(coalesce(v_address, '')), ''),
    nullif(trim(coalesce(v_location_full, '')), '')
  )
  on conflict (user_id) do update set
    tenant_id = excluded.tenant_id,
    role = excluded.role,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    phone = coalesce(excluded.phone, public.profiles.phone),
    mosque_position = coalesce(excluded.mosque_position, public.profiles.mosque_position),
    address = coalesce(excluded.address, public.profiles.address),
    location_full = coalesce(excluded.location_full, public.profiles.location_full);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

