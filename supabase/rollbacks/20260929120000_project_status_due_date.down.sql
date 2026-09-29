drop trigger if exists projects_enforce_designer_scope on public.projects;
drop function if exists private.enforce_designer_update_scope();
drop policy if exists "projects_update_status_assigned_designer" on public.projects;
drop function if exists private.can_access_project(uuid);
alter table public.projects drop column if exists due_date, drop column if exists status;
drop type if exists public.project_status;
