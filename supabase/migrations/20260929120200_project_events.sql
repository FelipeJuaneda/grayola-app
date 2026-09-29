-- =============================================================================
-- Grayola · 0007 · Historial de actividad por proyecto
--
-- Lo escriben solo triggers (SECURITY DEFINER): ningún rol de la API puede
-- insertar, editar ni borrar eventos, así el historial no se puede falsear.
-- Lo ve quien puede ver el proyecto.
-- Rollback: supabase/rollbacks/20260929120200_project_events.down.sql
-- =============================================================================

create type public.project_event_type as enum (
  'created', 'status_changed', 'assignees_changed', 'due_date_changed',
  'details_updated', 'file_added', 'file_removed'
);

create table public.project_events (
  id          bigint generated always as identity primary key,
  project_id  uuid not null references public.projects (id) on delete cascade,
  actor_id    uuid references auth.users (id) on delete set null,
  type        public.project_event_type not null,
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index project_events_project_idx on public.project_events (project_id, created_at desc);
create index project_events_actor_idx on public.project_events (actor_id);

alter table public.project_events enable row level security;
revoke all on public.project_events from anon;
revoke insert, update, delete on public.project_events from authenticated;

create policy "project_events_select_if_project_visible"
  on public.project_events for select to authenticated
  using (private.can_access_project(project_id));

create or replace function private.log_project_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
begin
  if tg_op = 'INSERT' then
    insert into public.project_events (project_id, actor_id, type, payload)
    values (new.id, coalesce(v_actor, new.created_by), 'created', jsonb_build_object('title', new.title));
    return new;
  end if;

  if new.status is distinct from old.status then
    insert into public.project_events (project_id, actor_id, type, payload)
    values (new.id, v_actor, 'status_changed', jsonb_build_object('from', old.status, 'to', new.status));
  end if;

  if new.assigned_to is distinct from old.assigned_to then
    insert into public.project_events (project_id, actor_id, type, payload)
    values (new.id, v_actor, 'assignees_changed', jsonb_build_object(
      'added',   to_jsonb(array(select unnest(new.assigned_to) except select unnest(old.assigned_to))),
      'removed', to_jsonb(array(select unnest(old.assigned_to) except select unnest(new.assigned_to)))
    ));
  end if;

  if new.due_date is distinct from old.due_date then
    insert into public.project_events (project_id, actor_id, type, payload)
    values (new.id, v_actor, 'due_date_changed', jsonb_build_object('from', old.due_date, 'to', new.due_date));
  end if;

  if new.title is distinct from old.title or new.description is distinct from old.description then
    insert into public.project_events (project_id, actor_id, type, payload)
    values (new.id, v_actor, 'details_updated', jsonb_build_object('title', new.title));
  end if;

  return new;
end;
$$;

create or replace function private.log_project_file_changes()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.project_events (project_id, actor_id, type, payload)
    values (new.project_id, coalesce(auth.uid(), new.uploaded_by), 'file_added', jsonb_build_object('name', new.name));
    return new;
  end if;
  -- Al borrar el proyecto en cascada no tiene sentido registrar nada.
  if exists (select 1 from public.projects where id = old.project_id) then
    insert into public.project_events (project_id, actor_id, type, payload)
    values (old.project_id, auth.uid(), 'file_removed', jsonb_build_object('name', old.name));
  end if;
  return old;
end;
$$;

revoke execute on function private.log_project_changes() from public, anon, authenticated;
revoke execute on function private.log_project_file_changes() from public, anon, authenticated;

create trigger projects_log_changes
  after insert or update on public.projects
  for each row execute function private.log_project_changes();

create trigger project_files_log_changes
  after insert or delete on public.project_files
  for each row execute function private.log_project_file_changes();
