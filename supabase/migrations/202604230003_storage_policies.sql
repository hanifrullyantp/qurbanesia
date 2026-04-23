-- Storage object RLS policies
-- These rely on path convention: `${tenant_id}/...`

alter table storage.objects enable row level security;

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
create policy "certificates_read_tenant" on storage.objects
for select
using (
  bucket_id = 'certificates'
  and public.object_belongs_to_current_tenant(name)
);

