-- Storage buckets for Qurbanesia (run on Supabase)
-- Note: storage schema exists by default in Supabase.

insert into storage.buckets (id, name, public)
values ('animal-media', 'animal-media', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', false)
on conflict (id) do nothing;

