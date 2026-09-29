"use client"

import { createBrowserClient } from "@supabase/ssr"

import type { Database } from "@/types/database"

import { supabaseEnv } from "./env"

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined

// Cliente del navegador (singleton). Se usa solo para lo que necesita
// correr en el cliente, como subir archivos con progreso.
export function createClient() {
  browserClient ??= createBrowserClient<Database>(supabaseEnv.url, supabaseEnv.publishableKey)
  return browserClient
}
