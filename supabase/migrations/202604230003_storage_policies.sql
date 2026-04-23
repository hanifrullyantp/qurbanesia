-- Storage object RLS policies
-- These rely on path convention: `${tenant_id}/...`
--
-- Note: On Supabase managed projects, `storage.objects` is owned/managed by Supabase.
-- Enabling/disabling RLS via ALTER TABLE may fail with:
--   ERROR: must be owner of table objects
-- In practice, RLS is already enabled for `storage.objects`. We only define policies here.

-- Helper: first path segment equals tenant id
create or replace function public.object_belongs_to_current_tenant(object_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select split_part(object_name, '/', 1) = public.current_tenant_id()::text;
$$;

-- animal-media bucket
drop policy if exists "animal_media_rw_tenant" on storage.objects;
create policy "animal_media_rw_tenant" on storage.objects
for all
using (
  bucket_id = 'animal-media'
  and public.object_belongs_to_current_tenant(name)
)
with check (
  bucket_id = 'animal-media'
  and public.object_belongs_to_current_tenant(name)
);

-- payment-proofs bucket
drop policy if exists "payment_proofs_rw_tenant" on storage.objects;
create policy "payment_proofs_rw_tenant" on storage.objects
for all
using (
  bucket_id = 'payment-proofs'
  and public.object_belongs_to_current_tenant(name)
)
with check (
  bucket_id = 'payment-proofs'
  and public.object_belongs_to_current_tenant(name)
);

-- certificates bucket (read for tenant users; write typically via Edge Function service role)
drop policy if exists "certificates_read_tenant" on storage.objects;
create policy "certificates_read_tenant" on storage.objects
for select
using (
  bucket_id = 'certificates'
  and public.object_belongs_to_current_tenant(name)
);

