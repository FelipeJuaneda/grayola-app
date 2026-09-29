import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

import type { Database } from "@/types/database"

import { supabaseEnv } from "./env"

const PROTECTED_PREFIXES = ["/proyectos", "/perfil"]
const AUTH_ROUTES = ["/login", "/register"]

// Refresca la sesión en cada request y redirige según haya usuario o no.
// Esto es solo UX: la autorización real vive en las Server Actions y en RLS.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(supabaseEnv.url, supabaseEnv.publishableKey, {
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
  const { data } = await supabase.auth.getClaims()
  const isSignedIn = Boolean(data?.claims)
  const { pathname } = request.nextUrl

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    url.search = ""
    const redirect = NextResponse.redirect(url)
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie)
    return redirect
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
