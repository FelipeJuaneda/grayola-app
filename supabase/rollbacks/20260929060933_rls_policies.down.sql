-- Aplicar primero el rollback de 0004 (devuelve las funciones a public).
drop policy if exists "profiles_select_self_pm_or_shared" on public.profiles;
drop policy if exists "profiles_update_own_name" on public.profiles;
drop policy if exists "projects_select_by_role" on public.projects;
drop policy if exists "projects_insert_client_or_pm" on public.projects;
drop policy if exists "projects_update_pm" on public.projects;
drop policy if exists "projects_delete_pm" on public.projects;
drop function if exists public.shares_project_with(uuid);
grant insert, update, delete on public.profiles to authenticated;
grant all on public.profiles, public.projects to anon;
-- RLS queda habilitada sin políticas = acceso denegado (estado seguro).
