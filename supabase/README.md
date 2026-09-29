# Base de datos

Migraciones versionadas del proyecto Supabase de Grayola (`supabase/migrations`),
aplicadas en orden. Cada una tiene su reversión en `supabase/rollbacks`
(aplicar en orden inverso).

| Versión | Qué hace |
|---|---|
| `20260929060914_init_schema` | Tablas `profiles` y `projects`, índices, trigger de perfil al registrarse y campos de auditoría |
| `20260929060933_rls_policies` | RLS por rol: cliente (propios), diseñador (asignados), PM (todo) |
| `20260929060936_storage_legacy_bucket` | Bucket `projects` transitorio (público) compatible con la app actual |
| `20260929061054_private_helper_functions` | Funciones auxiliares movidas a `private` (no expuestas como RPC) |

`seed.sql` crea los usuarios de prueba (contraseña `123456`) y proyectos demo.
Es idempotente y no es una migración: correrlo solo en entornos de desarrollo/demo.
