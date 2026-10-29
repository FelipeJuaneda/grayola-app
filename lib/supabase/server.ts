import "server-only"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import type { Database } from "@/types/database"

import { supabaseEnv } from "./env"
import { fetchWithTimeout } from "./fetch-timeout"

// Cliente por request para Server Components, Server Actions y Route Handlers.
// Actúa con la sesión del usuario: toda consulta pasa por RLS. Con un tope de
// tiempo para que una caída de Supabase se vea como error y no como 504.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(supabaseEnv.url, supabaseEnv.publishableKey, {
    global: { fetch: fetchWithTimeout(8000) },
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // Llamado desde un Server Component: el proxy ya refresca la sesión.
        }
      },
    },
  })
}
