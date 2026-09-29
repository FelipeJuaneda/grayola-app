drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists projects_audit_fields on public.projects;
drop table if exists public.projects;
drop table if exists public.profiles;
drop function if exists public.projects_set_audit_fields();
drop function if exists public.handle_new_user();
drop function if exists public.get_my_role();
