-- =============================================================================
-- Grayola · 0004 · Funciones auxiliares fuera de la API pública
--
-- Advisors 0028/0029: las funciones SECURITY DEFINER en `public` quedaban
-- expuestas como RPC (/rest/v1/rpc/...), `handle_new_user` incluso para anon.
-- Se mueven a un schema no expuesto. Políticas y triggers las referencian por
-- OID, así que siguen funcionando sin cambios.
-- Rollback: supabase/rollbacks/20260929061054_private_helper_functions.down.sql
-- =============================================================================

create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

alter function public.get_my_role() set schema private;
alter function public.shares_project_with(uuid) set schema private;
alter function public.handle_new_user() set schema private;

-- El trigger de auth.users no necesita que ningún rol de la API la ejecute.
revoke execute on function private.handle_new_user() from public, anon, authenticated;
