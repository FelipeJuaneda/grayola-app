import { createServerClient } from "@supabase/ssr"
import { isAuthRetryableFetchError } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"

import type { Database } from "@/types/database"

import { supabaseEnv } from "./env"
import { fetchWithTimeout } from "./fetch-timeout"

const PROTECTED_PREFIXES = ["/proyectos", "/perfil"]
const AUTH_ROUTES = ["/login", "/register"]

// Tope para validar la sesión: si Supabase no responde, la página carga igual
// (sin sesión) en vez de esperar hasta el timeout del middleware de Vercel.
const SESSION_TIMEOUT_MS = 3000

// Refresca la sesión en cada request y redirige según haya usuario o no.
// Esto es solo UX: la autorización real vive en las Server Actions y en RLS.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(supabaseEnv.url, supabaseEnv.publishableKey, {
    global: { fetch: fetchWithTimeout(SESSION_TIMEOUT_MS) },
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value)
        response = NextResponse.next({ request })
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options)
        }
      },
    },
  })

  // getClaims() valida la firma del JWT (a diferencia de getSession()).
  // Sin sesión devuelve { data: null, error: null }; si Supabase no responde,
  // un AuthRetryableFetchError.
  const { data, error } = await supabase.auth.getClaims()
  const serviceDown = isAuthRetryableFetchError(error)
  const isSignedIn = Boolean(data?.claims)
  const { pathname } = request.nextUrl

  const redirectTo = (path: string, notice?: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    url.search = notice ? `?aviso=${notice}` : ""
    const redirect = NextResponse.redirect(url)
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie)
    return redirect
  }

  if (serviceDown) {
    // No hay forma de validar la sesión: se muestra el login con un aviso.
    if (AUTH_ROUTES.includes(pathname)) return response
    return redirectTo("/login", "servicio")
  }

  if (!isSignedIn && PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return redirectTo("/login")
  }
  if (isSignedIn && (pathname === "/" || AUTH_ROUTES.includes(pathname))) {
    return redirectTo("/proyectos")
  }
  if (!isSignedIn && pathname === "/") {
    return redirectTo("/login")
  }

  return response
}
