drop policy if exists "projects_bucket_insert_authenticated" on storage.objects;
drop policy if exists "projects_bucket_select_authenticated" on storage.objects;
drop policy if exists "projects_bucket_delete_owner_or_pm" on storage.objects;
-- El bucket solo se puede borrar vacío (vaciarlo antes desde el dashboard).
delete from storage.buckets where id = 'projects';
