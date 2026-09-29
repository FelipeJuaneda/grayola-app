-- =============================================================================
-- Grayola · 0006 · Archivos privados por proyecto
--
-- * Tabla project_files (metadatos) en lugar de la columna JSON projects.files.
-- * Bucket PRIVADO `project-files`: solo se accede con URLs firmadas.
--   Ruta: <project_id>/<uuid>-<nombre-sanitizado>
-- * Quién sube: el PM o el cliente dueño del proyecto (mismo alcance que crear).
-- * Quién borra: solo el PM (regla de negocio: el cliente no edita proyectos).
--   En storage, además, el propio autor puede borrar su objeto para poder
--   limpiar una subida fallida.
-- * El bucket transitorio `projects` se vuelve privado y pierde sus políticas.
-- Rollback: supabase/rollbacks/20260929120100_project_files_private_storage.down.sql
-- =============================================================================

create table public.project_files (
  id           uuid primary key default gen_random_uuid(),
  project_id   uuid not null references public.projects (id) on delete cascade,
  path         text not null unique,
  name         text not null check (char_length(name) between 1 and 255),
  size         bigint not null check (size > 0 and size <= 20971520),
  mime_type    text not null,
  uploaded_by  uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at   timestamptz not null default now()
);

create index project_files_project_id_idx on public.project_files (project_id, created_at desc);
create index project_files_uploaded_by_idx on public.project_files (uploaded_by);

alter table public.project_files enable row level security;
revoke all on public.project_files from anon;
revoke update on public.project_files from authenticated;

create or replace function private.can_upload_to_project(p_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.projects p
    where p.id = p_project_id
      and (p.created_by = auth.uid() or private.get_my_role() = 'pm')
  )
$$;

-- Primer segmento de la ruta de storage como uuid (null si no es un uuid).
create or replace function private.project_id_from_path(p_name text)
returns uuid
language sql
immutable
set search_path = ''
as $$
  select case
    when split_part(p_name, '/', 1) ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    then split_part(p_name, '/', 1)::uuid
  end
$$;

revoke execute on function private.can_upload_to_project(uuid) from public, anon;
grant execute on function private.can_upload_to_project(uuid) to authenticated;
grant execute on function private.project_id_from_path(text) to authenticated;

create policy "project_files_select_if_project_visible"
  on public.project_files for select to authenticated
  using (private.can_access_project(project_id));

create policy "project_files_insert_owner_or_pm"
  on public.project_files for insert to authenticated
  with check (
    uploaded_by = (select auth.uid())
    and private.can_upload_to_project(project_id)
    and path like project_id::text || '/%'
  );

create policy "project_files_delete_pm"
  on public.project_files for delete to authenticated
  using ((select private.get_my_role()) = 'pm');

-- El JSON de archivos queda reemplazado por la tabla (solo había datos demo).
alter table public.projects drop column files;

-- ------------------------------------------------------------------ storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-files', 'project-files', false,
  20971520,
  array[
    'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml',
    'application/pdf', 'application/zip', 'application/x-zip-compressed'
  ]
)
on conflict (id) do nothing;

create policy "project_files_bucket_select"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'project-files'
    and private.can_access_project(private.project_id_from_path(name))
  );

create policy "project_files_bucket_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'project-files'
    and private.can_upload_to_project(private.project_id_from_path(name))
  );

create policy "project_files_bucket_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'project-files'
    and (owner_id = (select auth.uid())::text or (select private.get_my_role()) = 'pm')
  );

-- Retiro del bucket transitorio: sin políticas y privado.
drop policy if exists "projects_bucket_insert_authenticated" on storage.objects;
drop policy if exists "projects_bucket_delete_owner_or_pm" on storage.objects;
drop policy if exists "projects_bucket_select_authenticated" on storage.objects;
update storage.buckets set public = false where id = 'projects';
