-- =============================================================================
-- Grayola · seed de desarrollo/demo (NO es migración; idempotente)
-- 6 usuarios de prueba (pass 123456) + proyectos demo.
-- Deliberadamente NO restaura datos del backup: contiene cuentas reales de
-- terceros (evaluadores, otros candidatos) y archivos personales.
-- =============================================================================

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

insert into public.projects (id, title, description, created_by, assigned_to, created_at)
values
  ('b0000000-0000-4000-8000-000000000001', 'Rebranding Café Brújula',
   'Nuevo sistema de identidad para una cafetería de especialidad: logotipo, paleta, tipografías y aplicaciones en packaging y cartelería.',
   'a0000000-0000-4000-8000-000000000002',
   array['a0000000-0000-4000-8000-000000000004','a0000000-0000-4000-8000-000000000005']::uuid[],
   now() - interval '12 days'),
  ('b0000000-0000-4000-8000-000000000002', 'Landing de lanzamiento — app de turnos',
   'Landing page para el lanzamiento de una app de reservas: hero, beneficios, pricing y formulario de pre-registro.',
   'a0000000-0000-4000-8000-000000000002',
   array['a0000000-0000-4000-8000-000000000006']::uuid[],
   now() - interval '6 days'),
  ('b0000000-0000-4000-8000-000000000003', 'Piezas para redes — campaña de invierno',
   'Set de 12 piezas para Instagram (feed + stories) alineadas a la guía de marca existente.',
   'a0000000-0000-4000-8000-000000000003',
   '{}'::uuid[],
   now() - interval '2 days'),
  ('b0000000-0000-4000-8000-000000000004', 'Informe anual 2026',
   'Diseño editorial del informe anual: 40 páginas, infografías y versión web accesible.',
   'a0000000-0000-4000-8000-000000000003',
   array['a0000000-0000-4000-8000-000000000004']::uuid[],
   now() - interval '20 days')
on conflict (id) do nothing;
