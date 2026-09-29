import "server-only"

import { redirect } from "next/navigation"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"

export const ROLES = ["client", "designer", "pm"] as const
export type Role = (typeof ROLES)[number]

export type CurrentUser = {
  id: string
  email: string
  fullName: string | null
  role: Role
}

function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value)
}

// Una sola lectura de usuario + perfil por request (React cache).
// getUser() valida el token contra Supabase Auth.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).single()

  if (!profile || !isRole(profile.role)) return null

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile.full_name,
    role: profile.role,
  }
})

// Para páginas: sin sesión, al login.
export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  return user
}

export class AuthorizationError extends Error {
  constructor(message = "No tenés permiso para hacer esto.") {
    super(message)
    this.name = "AuthorizationError"
  }
}

// Para Server Actions: el rol se verifica en el servidor además de en RLS.
export async function requireRole(...allowed: Role[]) {
  const user = await getCurrentUser()
  if (!user) throw new AuthorizationError("Tu sesión expiró. Volvé a ingresar.")
  if (!allowed.includes(user.role)) throw new AuthorizationError()
  return user
}
