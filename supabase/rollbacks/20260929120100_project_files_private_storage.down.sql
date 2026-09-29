update storage.buckets set public = true where id = 'projects';
-- (re-aplicar las políticas de 20260929060936_storage_legacy_bucket.sql)
drop policy if exists "project_files_bucket_select" on storage.objects;
drop policy if exists "project_files_bucket_insert" on storage.objects;
drop policy if exists "project_files_bucket_delete" on storage.objects;
-- El bucket project-files solo se puede borrar vacío (vaciarlo desde el dashboard).
delete from storage.buckets where id = 'project-files';
alter table public.projects add column files jsonb not null default '[]'::jsonb check (jsonb_typeof(files) = 'array');
drop table if exists public.project_files;
drop function if exists private.project_id_from_path(text);
drop function if exists private.can_upload_to_project(uuid);
