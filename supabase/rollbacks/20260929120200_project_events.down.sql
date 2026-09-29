drop trigger if exists project_files_log_changes on public.project_files;
drop trigger if exists projects_log_changes on public.projects;
drop function if exists private.log_project_file_changes();
drop function if exists private.log_project_changes();
drop table if exists public.project_events;
drop type if exists public.project_event_type;
