"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { type ActionResult, describeDbError, fail, fromZodError, handleActionError, ok } from "@/lib/actions"
import { requireRole } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Tu nombre necesita al menos 2 letras.")
    .max(120, "El nombre puede tener hasta 120 caracteres."),
})

export async function updateProfileName(values: z.infer<typeof profileSchema>): Promise<ActionResult> {
  try {
    const user = await requireRole("client", "designer", "pm")
    const parsed = profileSchema.safeParse(values)
    if (!parsed.success) return fromZodError(parsed.error)

    const supabase = await createClient()
    // Privilegio de columna: la app solo puede tocar full_name.
    const { error } = await supabase.from("profiles").update({ full_name: parsed.data.fullName }).eq("id", user.id)
    if (error) return fail(describeDbError(error))

    revalidatePath("/", "layout")
    return ok(undefined)
  } catch (error) {
    return handleActionError(error)
  }
}
