-- =============================================================================
-- Grayola · 0001 · Esquema base (reconstruido desde el backup del 26-06-2025)
-- Fiel al modelo original, con correcciones de integridad:
--   * profiles.role default 'cliente' violaba su propio CHECK -> 'client'
--   * timestamps sin zona horaria -> timestamptz
--   * files / assigned_to NOT NULL con default vacío (evita null-checks en la app)
--   * created_by NOT NULL + default auth.uid()
-- Rollback: supabase/rollbacks/20260929060914_init_schema.down.sql
-- =============================================================================

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text check (char_length(full_name) <= 120),
  email       text,
  role        text not null default 'client'
              check (role in ('client', 'designer', 'pm')),
  created_at  timestamptz not null default now()
);

create table public.projects (
  id           uuid primary key default gen_random_uuid(),
  title        text not null check (char_length(btrim(title)) between 1 and 120),
  description  text check (char_length(description) <= 2000),
  files        jsonb not null default '[]'::jsonb
               check (jsonb_typeof(files) = 'array'),
  created_by   uuid not null default auth.uid()
               references auth.users (id) on delete cascade,
  assigned_to  uuid[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index projects_created_by_idx on public.projects (created_by);
create index projects_assigned_to_idx on public.projects using gin (assigned_to);
create index projects_created_at_idx on public.projects (created_at desc);

-- ---------------------------------------------------------------------------
-- Funciones auxiliares (search_path vacío: recomendación del advisor de Supabase)
-- ---------------------------------------------------------------------------

-- Rol del usuario actual. SECURITY DEFINER para poder usarla dentro de políticas
-- de profiles sin recursión de RLS.
create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = auth.uid()
$$;

-- Perfil automático al registrarse. Todo usuario nuevo nace como 'client';
-- los roles pm/designer solo se asignan desde el dashboard/SQL (no desde la app).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
    'client'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- created_by siempre es quien inserta (no se puede falsear desde el cliente)
-- y updated_at se mantiene solo.
create or replace function public.projects_set_audit_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    new.created_by := coalesce(auth.uid(), new.created_by);
    new.created_at := now();
  else
    new.created_by := old.created_by;   -- inmutable
    new.created_at := old.created_at;   -- inmutable
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger projects_audit_fields
  before insert or update on public.projects
  for each row execute function public.projects_set_audit_fields();
