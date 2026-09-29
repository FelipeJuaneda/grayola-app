-- =============================================================================
-- Grayola · 0005 · Estado del proyecto y fecha de entrega
--
-- * status: pending -> in_progress -> in_review -> delivered (default pending)
-- * due_date: fecha de entrega opcional
-- * Permiso nuevo (aprobado): el diseñador puede cambiar SOLO el estado de los
--   proyectos que tiene asignados. Un trigger rechaza cualquier otro cambio de
--   un diseñador; RLS sigue limitando qué filas puede tocar cada rol.
-- Rollback: supabase/rollbacks/20260929120000_project_status_due_date.down.sql
-- =============================================================================

create type public.project_status as enum ('pending', 'in_progress', 'in_review', 'delivered');

alter table public.projects
  add column status public.project_status not null default 'pending',
  add column due_date date;

create index projects_status_idx on public.projects (status);
create index projects_due_date_idx on public.projects (due_date) where due_date is not null;

-- ¿El usuario actual puede ver este proyecto? (reutilizada por archivos y eventos)
create or replace function private.can_access_project(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.projects p
    where p.id = p_project_id
      and (
        p.created_by = auth.uid()
        or auth.uid() = any (p.assigned_to)
        or private.get_my_role() = 'pm'
      )
  )
$$;

revoke execute on function private.can_access_project(uuid) from public, anon;
grant execute on function private.can_access_project(uuid) to authenticated;

create policy "projects_update_status_assigned_designer"
  on public.projects for update to authenticated
  using (
    (select private.get_my_role()) = 'designer'
    and (select auth.uid()) = any (assigned_to)
  )
  with check (
    (select private.get_my_role()) = 'designer'
    and (select auth.uid()) = any (assigned_to)
  );

create or replace function private.enforce_designer_update_scope()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null and private.get_my_role() = 'designer' then
    if new.title is distinct from old.title
      or new.description is distinct from old.description
      or new.assigned_to is distinct from old.assigned_to
      or new.due_date is distinct from old.due_date then
      raise exception 'Los diseñadores solo pueden cambiar el estado del proyecto.'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

revoke execute on function private.enforce_designer_update_scope() from public, anon, authenticated;

create trigger projects_enforce_designer_scope
  before update on public.projects
  for each row execute function private.enforce_designer_update_scope();
