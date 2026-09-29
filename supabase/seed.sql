-- =============================================================================
-- Grayola · seed de desarrollo/demo (NO es migración; idempotente)
-- 6 usuarios de prueba (pass 123456) + 10 proyectos demo con estados, fechas
-- de entrega e historial. Todo el contenido es ficticio.
-- Deliberadamente NO restaura datos del backup: contiene cuentas reales de
-- terceros (evaluadores, otros candidatos) y archivos personales.
-- =============================================================================

-- ------------------------------------------------------------------ usuarios
do $$
declare
  u record;
begin
  for u in
    select * from (values
      ('a0000000-0000-4000-8000-000000000001'::uuid, 'pm@gmail.com',        'Paula Martínez',  'pm'),
      ('a0000000-0000-4000-8000-000000000002'::uuid, 'cliente1@gmail.com',  'Lucía Fernández', 'client'),
      ('a0000000-0000-4000-8000-000000000003'::uuid, 'cliente2@gmail.com',  'Martín Ríos',     'client'),
      ('a0000000-0000-4000-8000-000000000004'::uuid, 'designer@gmail.com',  'Sofía Acosta',    'designer'),
      ('a0000000-0000-4000-8000-000000000005'::uuid, 'designer2@gmail.com', 'Tomás Herrera',   'designer'),
      ('a0000000-0000-4000-8000-000000000006'::uuid, 'designer3@gmail.com', 'Valentina Ruiz',  'designer')
    ) as t(id, email, full_name, role)
  loop
    if not exists (select 1 from auth.users where email = u.email) then
      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
        raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
      ) values (
        '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated',
        u.email, extensions.crypt('123456', extensions.gen_salt('bf')), now(),
        '{"provider":"email","providers":["email"]}',
        jsonb_build_object('full_name', u.full_name), now(), now(), '', '', '', ''
      );
      insert into auth.identities (
        id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
      ) values (
        gen_random_uuid(), u.id, u.id::text,
        jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
        'email', now(), now(), now()
      );
    end if;
    -- el trigger crea el perfil como 'client'; acá se fija el rol real
    update public.profiles set role = u.role, full_name = u.full_name where id = u.id;
  end loop;
end $$;

-- ------------------------------------------------------------------ proyectos
create temp table seed_projects (
  id uuid, title text, description text, created_by uuid, assigned_to uuid[],
  status public.project_status, due_in_days int, age_days int
) on commit drop;

insert into seed_projects values
  ('b0000000-0000-4000-8000-000000000001', 'Rebranding Café Brújula',
   'Nuevo sistema de identidad para una cafetería de especialidad: logotipo, paleta, tipografías y aplicaciones en packaging y cartelería.',
   'a0000000-0000-4000-8000-000000000002', array['a0000000-0000-4000-8000-000000000004','a0000000-0000-4000-8000-000000000005']::uuid[], 'in_progress', 9, 12),
  ('b0000000-0000-4000-8000-000000000002', 'Landing de lanzamiento — app de turnos',
   'Landing page para el lanzamiento de una app de reservas: hero, beneficios, pricing y formulario de pre-registro.',
   'a0000000-0000-4000-8000-000000000002', array['a0000000-0000-4000-8000-000000000006']::uuid[], 'in_review', 3, 6),
  ('b0000000-0000-4000-8000-000000000003', 'Piezas para redes — campaña de invierno',
   'Set de 12 piezas para Instagram (feed + stories) alineadas a la guía de marca existente.',
   'a0000000-0000-4000-8000-000000000003', '{}'::uuid[], 'pending', 14, 2),
  ('b0000000-0000-4000-8000-000000000004', 'Informe anual 2026',
   'Diseño editorial del informe anual: 40 páginas, infografías y versión web accesible.',
   'a0000000-0000-4000-8000-000000000003', array['a0000000-0000-4000-8000-000000000004']::uuid[], 'delivered', -5, 20),
  ('b0000000-0000-4000-8000-000000000005', 'Packaging línea orgánica',
   'Etiquetas y cajas para una línea de cinco productos orgánicos, con versión para e-commerce.',
   'a0000000-0000-4000-8000-000000000002', array['a0000000-0000-4000-8000-000000000005']::uuid[], 'in_progress', -2, 16),
  ('b0000000-0000-4000-8000-000000000006', 'Señalética para cowork',
   'Sistema de señalética para un cowork de tres pisos: direccionales, identificación de salas y normas de uso.',
   'a0000000-0000-4000-8000-000000000003', '{}'::uuid[], 'pending', null, 1),
  ('b0000000-0000-4000-8000-000000000007', 'Sistema de íconos para app bancaria',
   '48 íconos de interfaz en dos pesos, con guía de uso y exportación para iOS y Android.',
   'a0000000-0000-4000-8000-000000000002', array['a0000000-0000-4000-8000-000000000004','a0000000-0000-4000-8000-000000000006']::uuid[], 'in_review', 6, 10),
  ('b0000000-0000-4000-8000-000000000008', 'Plantilla de newsletter mensual',
   'Plantilla de email responsive con módulos reutilizables para el newsletter de la marca.',
   'a0000000-0000-4000-8000-000000000003', array['a0000000-0000-4000-8000-000000000005']::uuid[], 'delivered', -18, 30),
  ('b0000000-0000-4000-8000-000000000009', 'Presentación para ronda de inversión',
   'Deck de 18 slides para inversores: narrativa, gráficos de tracción y anexo financiero.',
   'a0000000-0000-4000-8000-000000000002', array['a0000000-0000-4000-8000-000000000004']::uuid[], 'in_progress', 2, 5),
  ('b0000000-0000-4000-8000-000000000010', 'Menú y cartelería — Bodegón del Sur',
   'Carta impresa y QR, pizarras y vinilos para la vidriera de un bodegón de barrio.',
   'a0000000-0000-4000-8000-000000000003', '{}'::uuid[], 'pending', 21, 0);

insert into public.projects (id, title, description, created_by, assigned_to, status, due_date, created_at, updated_at)
select id, title, description, created_by, assigned_to, status,
       case when due_in_days is null then null else current_date + due_in_days end,
       now() - make_interval(days => age_days, hours => 3),
       now() - make_interval(days => greatest(age_days - 1, 0))
from seed_projects
on conflict (id) do update set
  title = excluded.title, description = excluded.description, created_by = excluded.created_by,
  assigned_to = excluded.assigned_to, status = excluded.status, due_date = excluded.due_date,
  created_at = excluded.created_at, updated_at = excluded.updated_at;

-- ------------------------------------------------------------------ historial
-- Los triggers registran eventos "de sistema" al correr el seed; se reemplazan
-- por un historial curado y coherente con el estado de cada proyecto.
delete from public.project_events where project_id in (select id from seed_projects);

insert into public.project_events (project_id, actor_id, type, payload, created_at)
select id, created_by, 'created'::public.project_event_type, jsonb_build_object('title', title),
       now() - make_interval(days => age_days, hours => 3)
from seed_projects
union all
select id, 'a0000000-0000-4000-8000-000000000001', 'assignees_changed',
       jsonb_build_object('added', to_jsonb(assigned_to), 'removed', '[]'::jsonb),
       now() - make_interval(days => age_days, hours => 1)
from seed_projects where cardinality(assigned_to) > 0
union all
select id, assigned_to[1], 'status_changed', '{"from":"pending","to":"in_progress"}'::jsonb,
       now() - make_interval(days => greatest(age_days - 1, 0), hours => 20)
from seed_projects where status in ('in_progress', 'in_review', 'delivered')
union all
select id, assigned_to[1], 'status_changed', '{"from":"in_progress","to":"in_review"}',
       now() - make_interval(days => greatest(age_days - 4, 0), hours => 6)
from seed_projects where status in ('in_review', 'delivered')
union all
select id, 'a0000000-0000-4000-8000-000000000001', 'status_changed', '{"from":"in_review","to":"delivered"}',
       now() - make_interval(days => greatest(age_days - 8, 0), hours => 2)
from seed_projects where status = 'delivered';
