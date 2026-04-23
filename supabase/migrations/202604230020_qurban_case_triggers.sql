-- Ensure qurban_cases exists for each shohibul

create or replace function public.ensure_qurban_case_for_shohibul()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.qurban_cases(tenant_id, shohibul_id, animal_id, status, last_updated_at)
  values (new.tenant_id, new.id, null, new.status, now())
  on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists trg_shohibul_create_case on public.shohibuls;
create trigger trg_shohibul_create_case
after insert on public.shohibuls
for each row execute function public.ensure_qurban_case_for_shohibul();

-- Sync animal assignment to qurban_cases when participants inserted
create or replace function public.sync_case_animal_on_participant()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.qurban_cases
    set animal_id = new.animal_id,
        last_updated_at = now()
  where shohibul_id = new.shohibul_id;
  return new;
end;
$$;

drop trigger if exists trg_participant_sync_case_animal on public.animal_participants;
create trigger trg_participant_sync_case_animal
after insert on public.animal_participants
for each row execute function public.sync_case_animal_on_participant();

