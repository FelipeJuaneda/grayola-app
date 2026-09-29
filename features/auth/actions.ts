"use server"

import { redirect } from "next/navigation"
import { z } from "zod"

import { type ActionResult, fail, fromZodError, ok } from "@/lib/actions"
import { createClient } from "@/lib/supabase/server"

import { DEMO_ROLES, type DemoRole, type SignInValues, type SignUpValues, signInSchema, signUpSchema } from "./schemas"

type AuthErrorLike = { code?: string; message?: string; status?: number }

function describeAuthError(error: AuthErrorLike) {
  switch (error.code) {
    case "invalid_credentials":
      return "El correo o la contraseña no coinciden."
    case "email_not_confirmed":
      return "Todavía no confirmaste tu correo. Revisá tu bandeja de entrada."
    case "user_already_exists":
    case "email_exists":
      return "Ya existe una cuenta con ese correo. Probá ingresar."
    case "weak_password":
      return "Esa contraseña es muy débil. Probá con una más larga."
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Hiciste muchos intentos seguidos. Esperá un minuto y probá de nuevo."
    case "signup_disabled":
      return "El registro está deshabilitado en este momento."
    default:
      return error.status && error.status >= 500
        ? "El servicio de autenticación no responde. Probá en unos minutos."
        : "No pudimos completar la operación. Probá de nuevo."
  }
}

export async function signIn(values: SignInValues): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(values)
  if (!parsed.success) return fromZodError(parsed.error)

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return fail(describeAuthError(error))
  redirect("/proyectos")
}

export async function signUp(values: SignUpValues): Promise<ActionResult<{ needsConfirmation: boolean }>> {
  const parsed = signUpSchema.safeParse(values)
  if (!parsed.success) return fromZodError(parsed.error)

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    // El trigger de perfil toma el nombre de acá; el rol siempre es "client".
    options: { data: { full_name: parsed.data.fullName } },
  })
  if (error) return fail(describeAuthError(error))
  if (data.session) redirect("/proyectos")
  return ok({ needsConfirmation: true })
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

// Acceso de un clic para quienes evalúan el portfolio. Las cuentas y la
// contraseña de demo son públicas (README); se desactiva con DEMO_ACCESS=off.
const DEMO_ACCOUNTS: Record<DemoRole, string> = {
  pm: "pm@gmail.com",
  client: "cliente1@gmail.com",
  designer: "designer@gmail.com",
}

export async function demoSignIn(role: DemoRole): Promise<ActionResult> {
  if (process.env.DEMO_ACCESS === "off") return fail("El acceso de demo está deshabilitado.")
  const parsed = z.enum(DEMO_ROLES).safeParse(role)
  if (!parsed.success) return fail("Rol de demo inválido.")

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: DEMO_ACCOUNTS[parsed.data],
    password: process.env.DEMO_PASSWORD ?? "123456",
  })
  if (error) return fail(describeAuthError(error))
  redirect("/proyectos")
}
