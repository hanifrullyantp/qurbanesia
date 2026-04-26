-- Invite codes (per masjid) + join requests + activation RPC

-- Invite codes: admin can create; unauthenticated need RPC to resolve code safely.
create table if not exists public.tenant_invite_codes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  default_join_role text,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  constraint tenant_invite_codes_code_key unique (code)
);
create index if not exists idx_tenant_invite_codes_tenant on public.tenant_invite_codes(tenant_id);

do $$ begin
  create type public.join_request_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

create table if not exists public.join_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  requested_role text not null check (requested_role in (
    'super_admin','admin_masjid','panitia','shohibul','jagal','supplier','penerima'
  )),
  status public.join_request_status not null default 'pending',
  message text,
  decided_by uuid references auth.users(id) on delete set null,
  decided_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists idx_join_requests_tenant_status on public.join_requests(tenant_id, status);
create index if not exists idx_join_requests_user on public.join_requests(user_id);

-- One pending request per (user, tenant)
create unique index if not exists join_requests_one_pending
  on public.join_requests (user_id, tenant_id)
  where (status = 'pending');

-- RLS
alter table public.tenant_invite_codes enable row level security;
alter table public.join_requests enable row level security;

drop policy if exists "tenant_invite_read_member" on public.tenant_invite_codes;
create policy "tenant_invite_read_member" on public.tenant_invite_codes
for select using (
  public.current_role() = 'super_admin'
  or tenant_id = public.current_tenant_id()
);

drop policy if exists "tenant_invite_write_admin" on public.tenant_invite_codes;
create policy "tenant_invite_write_admin" on public.tenant_invite_codes
for all using (
  public.current_role() = 'super_admin'
  or (public.current_role() = 'admin_masjid' and tenant_id = public.current_tenant_id())
)
with check (
  public.current_role() = 'super_admin'
  or (public.current_role() = 'admin_masjid' and tenant_id = public.current_tenant_id())
);

drop policy if exists "join_requests_insert_own" on public.join_requests;
create policy "join_requests_insert_own" on public.join_requests
for insert with check (user_id = auth.uid());

drop policy if exists "join_requests_select_self_or_tenant" on public.join_requests;
create policy "join_requests_select_self_or_tenant" on public.join_requests
for select using (
  user_id = auth.uid()
  or public.current_role() = 'super_admin'
  or (public.current_tenant_id() = tenant_id and public.current_role() = 'admin_masjid')
);

drop policy if exists "join_requests_update_admin" on public.join_requests;
create policy "join_requests_update_admin" on public.join_requests
for update using (
  public.current_role() = 'super_admin'
  or (public.current_tenant_id() = tenant_id and public.current_role() = 'admin_masjid')
)
with check (
  public.current_role() = 'super_admin'
  or (public.current_tenant_id() = tenant_id and public.current_role() = 'admin_masjid')
);

-- Public resolver (no PII) — hanya by exact kode; tidak expose list
create or replace function public.resolve_invite_code(p_code text)
returns table (out_tenant_id uuid, out_default_role text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v text := upper(trim(p_code));
begin
  if v is null or length(v) < 2 then
    return;
  end if;
  return query
  select c.tenant_id, c.default_join_role
  from public.tenant_invite_codes c
  where upper(c.code) = v
    and c.is_active
    and (c.expires_at is null or c.expires_at > now())
  limit 1;
end;
$$;

revoke all on function public.resolve_invite_code(text) from public;
grant execute on function public.resolve_invite_code(text) to anon, authenticated;

-- Label masjid read-only (untuk halaman /view ?t=) — tanpa auth
create or replace function public.get_tenant_public(p_tenant_id uuid)
returns table (o_name text, o_location text)
language sql
security definer
set search_path = public
stable
as $$
  select t.name, t.location from public.tenants t where t.id = p_tenant_id;
$$;

revoke all on function public.get_tenant_public(uuid) from public;
grant execute on function public.get_tenant_public(uuid) to anon, authenticated;

-- Aktivasi pengurus: buat tenant + set profil (satu kali) — user tanpa tenant
create or replace function public.activate_tenant_as_masjid(p_masjid_name text, p_location text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  t_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated';
  end if;
  if exists (select 1 from public.profiles p where p.user_id = v_uid and p.tenant_id is not null) then
    raise exception 'already_has_tenant';
  end if;
  if length(trim(p_masjid_name)) < 2 then
    raise exception 'invalid_name';
  end if;

  insert into public.tenants (name, location, onboarding_profile_complete)
  values (trim(p_masjid_name), nullif(trim(coalesce(p_location, '')), ''), true)
  returning id into t_id;

  update public.profiles
  set
    tenant_id = t_id,
    role = 'admin_masjid',
    full_name = coalesce(nullif(full_name, ''), null)
  where user_id = v_uid;

  return t_id;
end;
$$;

revoke all on function public.activate_tenant_as_masjid(text, text) from public;
grant execute on function public.activate_tenant_as_masjid(text, text) to authenticated;

-- Approve: admin_masjid tenant harus match; perbarui profil penerima (bypass RLS)
create or replace function public.approve_join_request(p_request_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.join_requests%rowtype;
  v_caller_role text;
  v_caller_tenant uuid;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  select p.role, p.tenant_id into v_caller_role, v_caller_tenant
  from public.profiles p where p.user_id = auth.uid();

  select * into r from public.join_requests where id = p_request_id for update;
  if not found then
    raise exception 'not_found';
  end if;
  if r.status is distinct from 'pending' then
    raise exception 'not_pending';
  end if;
  if v_caller_role = 'super_admin' or (v_caller_role = 'admin_masjid' and v_caller_tenant = r.tenant_id) then
    null;
  else
    raise exception 'forbidden';
  end if;

  update public.join_requests
  set status = 'approved', decided_by = auth.uid(), decided_at = now()
  where id = p_request_id;

  update public.profiles
  set
    tenant_id = r.tenant_id,
    role = r.requested_role
  where user_id = r.user_id;
end;
$$;

revoke all on function public.approve_join_request(uuid) from public;
grant execute on function public.approve_join_request(uuid) to authenticated;

create or replace function public.reject_join_request(p_request_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.join_requests%rowtype;
  v_caller_role text;
  v_caller_tenant uuid;
begin
  if auth.uid() is null then
    raise exception 'not_authenticated';
  end if;
  select p.role, p.tenant_id into v_caller_role, v_caller_tenant
  from public.profiles p where p.user_id = auth.uid();

  select * into r from public.join_requests where id = p_request_id;
  if not found then
    raise exception 'not_found';
  end if;
  if r.status is distinct from 'pending' then
    raise exception 'not_pending';
  end if;
  if v_caller_role = 'super_admin' or (v_caller_role = 'admin_masjid' and v_caller_tenant = r.tenant_id) then
    null;
  else
    raise exception 'forbidden';
  end if;

  update public.join_requests
  set status = 'rejected', decided_by = auth.uid(), decided_at = now()
  where id = p_request_id;
end;
$$;

revoke all on function public.reject_join_request(uuid) from public;
grant execute on function public.reject_join_request(uuid) to authenticated;
