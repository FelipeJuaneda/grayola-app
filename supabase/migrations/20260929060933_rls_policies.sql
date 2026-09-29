-- =============================================================================
-- Grayola · 0002 · RLS por rol (reemplaza las políticas del backup)
--
-- Huecos del original que cierra esta migración:
--   * UPDATE/DELETE "Usuarios autenticados pueden editar/eliminar proyectos":
--     cualquier cliente o diseñador podía editar o borrar CUALQUIER proyecto.
--   * INSERT WITH CHECK (true): un cliente podía autoasignarse diseñadores.
--   * "Leer perfiles de diseñadores": todo usuario veía nombre+email de todos
--     los diseñadores.
--   * Políticas SELECT duplicadas.
--
-- Matriz resultante (misma lógica de negocio que la app):
--               ver                     crear            editar/asignar  borrar
--   client      propios                 sí (sin asignar) no              no
--   designer    asignados               no               no              no
--   pm          todos                   sí               sí              sí
--
-- Perfiles: cada uno ve el suyo; el PM ve todos; el resto solo ve a quienes
-- comparten un proyecto con él (cliente <-> diseñadores asignados).
-- Rollback: supabase/rollbacks/20260929060933_rls_policies.down.sql
-- =============================================================================

-- Auditoría: desde la app (hay auth.uid()) created_by/created_at no se pueden falsear;
-- desde SQL de mantenimiento/seed (sin auth.uid()) se respetan los valores dados.
create or replace function public.projects_set_audit_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if auth.uid() is not null then
      new.created_by := auth.uid();
      new.created_at := now();
    end if;
  else
    new.created_by := old.created_by;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;

-- Sin acceso anónimo a los datos de negocio.
revoke all on public.profiles, public.projects from anon;

-- Perfiles: la app solo puede cambiar el nombre propio. El rol NO es editable
-- por el usuario (privilegio de columna, no depende de la UI).
revoke insert, update, delete on public.profiles from authenticated;
grant update (full_name) on public.profiles to authenticated;

-- ¿El usuario actual comparte algún proyecto visible con `target`?
create or replace function public.shares_project_with(target uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.projects p
    where (p.created_by = auth.uid() or auth.uid() = any (p.assigned_to))
      and (p.created_by = target or target = any (p.assigned_to))
  )
$$;

-- ---------------------------------------------------------------- profiles
create policy "profiles_select_self_pm_or_shared"
  on public.profiles for select to authenticated
  using (
    id = (select auth.uid())
    or (select public.get_my_role()) = 'pm'
    or public.shares_project_with(id)
  );

create policy "profiles_update_own_name"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- ---------------------------------------------------------------- projects
create policy "projects_select_by_role"
  on public.projects for select to authenticated
  using (
    created_by = (select auth.uid())
    or (select auth.uid()) = any (assigned_to)
    or (select public.get_my_role()) = 'pm'
  );

create policy "projects_insert_client_or_pm"
  on public.projects for insert to authenticated
  with check (
    (select public.get_my_role()) = 'pm'
    or (
      (select public.get_my_role()) = 'client'
      and cardinality(assigned_to) = 0      -- solo el PM asigna
    )
  );

create policy "projects_update_pm"
  on public.projects for update to authenticated
  using ((select public.get_my_role()) = 'pm')
  with check ((select public.get_my_role()) = 'pm');

create policy "projects_delete_pm"
  on public.projects for delete to authenticated
  using ((select public.get_my_role()) = 'pm');

-- Las funciones auxiliares no deben ser invocables por anónimos vía RPC.
revoke execute on function public.get_my_role() from anon, public;
revoke execute on function public.shares_project_with(uuid) from anon, public;
grant execute on function public.get_my_role() to authenticated;
grant execute on function public.shares_project_with(uuid) to authenticated;
