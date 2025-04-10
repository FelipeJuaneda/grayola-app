"use server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// Obtener sesion
export async function getSession() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError) return null;
  return session;
}
