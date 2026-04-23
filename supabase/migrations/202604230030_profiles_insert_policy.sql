-- Allow a freshly signed-up user to insert their own profile row.
-- Without this, signup flows that create `profiles` client-side will fail under RLS.

alter table public.profiles enable row level security;

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert
with check (user_id = auth.uid());

