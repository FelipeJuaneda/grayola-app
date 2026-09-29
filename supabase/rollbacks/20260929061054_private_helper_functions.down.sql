alter function private.get_my_role() set schema public;
alter function private.shares_project_with(uuid) set schema public;
alter function private.handle_new_user() set schema public;
drop schema if exists private;
