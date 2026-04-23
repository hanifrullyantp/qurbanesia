-- Add extra profile fields for signup form

alter table public.profiles
  add column if not exists mosque_position text,
  add column if not exists address text,
  add column if not exists location_full text;

