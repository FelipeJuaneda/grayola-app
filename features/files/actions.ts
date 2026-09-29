"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { type ActionResult, describeDbError, fail, handleActionError, ok } from "@/lib/actions"
import { getCurrentUser, requireRole } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

import { storageSafeName, validateFile } from "./constants"

const BUCKET = "project-files"

const fileMetaSchema = z.object({
  projectId: z.uuid(),
  name: z.string().min(1).max(255),
  size: z.number().int().positive(),
  type: z.string().min(1),
})

export type UploadTarget = { path: string; signedUrl: string }

// Paso 1: URL firmada de subida. Storage verifica con RLS que quien la pide
// pueda subir a ese proyecto (cliente dueño o PM).
export async function createUploadTarget(input: z.infer<typeof fileMetaSchema>): Promise<ActionResult<UploadTarget>> {
  try {
    await requireRole("client", "pm")
    const parsed = fileMetaSchema.safeParse(input)
    if (!parsed.success) return fail("Archivo inválido.")
    const invalid = validateFile(parsed.data)
    if (invalid) return fail(invalid)

    const path = `${parsed.data.projectId}/${crypto.randomUUID()}-${storageSafeName(parsed.data.name)}`
    const supabase = await createClient()
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path)
    if (error || !data) return fail("No tenés permiso para subir archivos a este proyecto.")
    return ok({ path: data.path, signedUrl: data.signedUrl })
  } catch (error) {
    return handleActionError(error)
  }
}

// Paso 2: registrar los metadatos una vez que el archivo llegó a Storage.
export async function registerUploadedFile(
  input: z.infer<typeof fileMetaSchema> & { path: string },
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRole("client", "pm")
    const parsed = fileMetaSchema.extend({ path: z.string().min(1) }).safeParse(input)
    if (!parsed.success) return fail("Archivo inválido.")
    const { projectId, name, size, type, path } = parsed.data
    if (!path.startsWith(`${projectId}/`)) return fail("Ruta de archivo inválida.")

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("project_files")
      .insert({ project_id: projectId, path, name, size, mime_type: type })
      .select("id")
      .single()

    if (error) {
      await supabase.storage.from(BUCKET).remove([path])
      return fail(describeDbError(error))
    }
    revalidatePath(`/proyectos/${projectId}`)
    return ok({ id: data.id })
  } catch (error) {
    return handleActionError(error)
  }
}

export async function deleteProjectFile(fileId: string): Promise<ActionResult> {
  try {
    await requireRole("pm")
    const parsed = z.uuid().safeParse(fileId)
    if (!parsed.success) return fail("Archivo inválido.")

    const supabase = await createClient()
    const { data: file } = await supabase
      .from("project_files")
      .select("path, project_id")
      .eq("id", parsed.data)
      .maybeSingle()
    if (!file) return fail("No encontramos el archivo.")

    const { error } = await supabase.from("project_files").delete().eq("id", parsed.data)
    if (error) return fail(describeDbError(error))
    await supabase.storage.from(BUCKET).remove([file.path])

    revalidatePath(`/proyectos/${file.project_id}`)
    return ok(undefined)
  } catch (error) {
    return handleActionError(error)
  }
}

// URL de descarga de corta duración, pedida en el momento del clic.
export async function getFileDownloadUrl(fileId: string): Promise<ActionResult<{ url: string }>> {
  try {
    if (!(await getCurrentUser())) return fail("Tu sesión expiró. Volvé a ingresar.")
    const parsed = z.uuid().safeParse(fileId)
    if (!parsed.success) return fail("Archivo inválido.")

    const supabase = await createClient()
    const { data: file } = await supabase.from("project_files").select("path, name").eq("id", parsed.data).maybeSingle()
    if (!file) return fail("No encontramos el archivo o no tenés acceso.")

    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(file.path, 60, { download: file.name })
    if (error || !data) return fail("No pudimos generar el enlace de descarga.")
    return ok({ url: data.signedUrl })
  } catch (error) {
    return handleActionError(error)
  }
}
