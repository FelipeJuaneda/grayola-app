import "server-only"

import { z } from "zod"

import { AuthorizationError } from "@/lib/auth/session"

// Resultado uniforme de las Server Actions: nunca se lanzan errores crudos
// al cliente; los formularios reciben mensajes en español por campo.
export type ActionResult<T = void> =
  { ok: true; data: T } | { ok: false; error: string; fieldErrors?: Record<string, string[]> }

export function ok<T>(data: T): ActionResult<T> {
  return { ok: true, data }
}

export function fail(error: string, fieldErrors?: Record<string, string[]>): ActionResult<never> {
  return { ok: false, error, fieldErrors }
}

export function fromZodError(error: z.ZodError): ActionResult<never> {
  const { fieldErrors } = z.flattenError(error)
  return fail("Revisá los campos marcados.", fieldErrors as Record<string, string[]>)
}

type PostgrestLikeError = { code?: string; message?: string } | null | undefined

// Traduce errores de Supabase/Postgres a mensajes útiles en español.
export function describeDbError(error: PostgrestLikeError): string {
  if (!error) return "Ocurrió un error inesperado. Probá de nuevo."
  switch (error.code) {
    case "42501":
      return error.message?.startsWith("Los diseñadores") ? error.message : "No tenés permiso para hacer esto."
    case "23505":
      return "Ya existe un registro igual."
    case "23514":
      return "Algún dato no cumple las reglas (revisá largos y formatos)."
    case "PGRST116":
      return "No encontramos lo que buscabas o no tenés acceso."
    default:
      return "No pudimos guardar los cambios. Probá de nuevo en unos segundos."
  }
}

export function handleActionError(error: unknown): ActionResult<never> {
  if (error instanceof AuthorizationError) return fail(error.message)
  console.error(error)
  return fail("Ocurrió un error inesperado. Probá de nuevo.")
}
