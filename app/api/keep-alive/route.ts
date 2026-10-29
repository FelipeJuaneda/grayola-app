import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

import { supabaseEnv } from "@/lib/supabase/env"
import { fetchWithTimeout } from "@/lib/supabase/fetch-timeout"
import type { Database } from "@/types/database"

// El plan gratuito de Supabase pausa los proyectos tras 7 días sin actividad.
// Un cron diario de Vercel (vercel.json) llama a esta ruta y hace una consulta
// mínima para que la base registre actividad. No devuelve datos: el rol anónimo
// no tiene acceso a las tablas, alcanza con que la consulta llegue a Postgres.
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  // Vercel envía CRON_SECRET como Bearer cuando la variable está definida.
  const secret = process.env.CRON_SECRET
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const supabase = createClient<Database>(supabaseEnv.url, supabaseEnv.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: fetchWithTimeout(8000) },
  })

  const startedAt = Date.now()
  const { error } = await supabase.from("projects").select("id", { head: true, count: "exact" })

  // "permission denied" (42501) es la respuesta esperada para anon: Postgres respondió.
  const reachable = !error || error.code === "42501"
  return NextResponse.json(
    { ok: reachable, ms: Date.now() - startedAt, at: new Date().toISOString() },
    { status: reachable ? 200 : 503 },
  )
}
