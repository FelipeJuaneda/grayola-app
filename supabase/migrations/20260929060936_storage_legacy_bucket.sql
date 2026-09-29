-- =============================================================================
-- Grayola · 0003 · Bucket `projects` (TRANSITORIO, compatible con el código actual)
--
-- El código actual usa getPublicUrl y sube/borra desde el navegador, así que el
-- bucket tiene que ser público para que la app vieja funcione durante la
-- auditoría por rol. Respecto del original se cierra lo más grave: las 4
-- políticas "ALL 1iiiika_*" no tenían rol, o sea que un ANÓNIMO podía subir,
-- sobrescribir y borrar cualquier archivo.
--
-- En la Fase 2 se reemplaza por: bucket privado + URLs firmadas + tabla
-- project_files + políticas por proyecto (migración propia, con su rollback).
-- Rollback: supabase/rollbacks/20260929060936_storage_legacy_bucket.down.sql
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'projects', 'projects', true,
  20971520, -- 20 MB
  array[
    'image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml',
    'application/pdf', 'application/zip', 'application/x-zip-compressed'
  ]
)
on conflict (id) do nothing;

create policy "projects_bucket_insert_authenticated"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'projects');

create policy "projects_bucket_delete_owner_or_pm"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'projects'
    and (owner_id = (select auth.uid())::text or (select public.get_my_role()) = 'pm')
  );

-- remove() del SDK necesita poder leer la fila del objeto.
create policy "projects_bucket_select_authenticated"
  on storage.objects for select to authenticated
  using (bucket_id = 'projects');
