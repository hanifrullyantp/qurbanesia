-- Storage buckets for Qurbanesia (run on Supabase)
-- Note: storage schema exists by default in Supabase.

select
  storage.create_bucket('animal-media', public := false)
where not exists (select 1 from storage.buckets where id = 'animal-media');

select
  storage.create_bucket('payment-proofs', public := false)
where not exists (select 1 from storage.buckets where id = 'payment-proofs');

select
  storage.create_bucket('certificates', public := false)
where not exists (select 1 from storage.buckets where id = 'certificates');

