"use server"

import { revalidatePath } from "next/cache"

import {
  type ActionResult,
  describeDbError,
  fail,
  fromZodError,
  handleActionError,
  ok,
} from "@/lib/actions"
import { requireRole } from "@/lib/auth/session"
import { createClient } from "@/lib/supabase/server"

import type { ProjectStatus } from "./constants"
import {
  type ProjectFormValues,
  projectFormSchema,
  projectIdSchema,
  projectStatusSchema,
} from "./schemas"

type Supabase = Awaited<ReturnType<typeof createClient>>

// Que cada id asignado sea realmente un diseñador (no solo un uuid válido).
async function assertDesigners(supabase: Supabase, ids: string[]) {
  if (ids.length === 0) return true
  const { count } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("role", "designer")
    .in("id", ids)
  return count === new Set(ids).size
}

function revalidateProject(id?: string) {
  revalidatePath("/proyectos")
  if (id) revalidatePath(`/proyectos/${id}`)
}

export async function createProject(values: ProjectFormValues): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireRole("client", "pm")
    const parsed = projectFormSchema.safeParse(values)
    if (!parsed.success) return fromZodError(parsed.error)

    const { title, description, dueDate, assignedTo } = parsed.data
    const supabase = await createClient()

    // Solo el PM asigna; si un cliente manda asignados, se ignoran.
    const assigned = user.role === "pm" ? assignedTo : []
    if (!(await assertDesigners(supabase, assigned))) {
      return fail("Alguno de los asignados no es diseñador.", { assignedTo: ["Revisá la selección."] })
    }

    const { data, error } = await supabase
      .from("projects")
      .insert({
        title,
        description: description || null,
        due_date: dueDate || null,
        assigned_to: assigned,
      })
      .select("id")
      .single()

    if (error) return fail(describeDbError(error))
    revalidateProject()
    return ok({ id: data.id })
  } catch (error) {
    return handleActionError(error)
  }
}

export async function updateProject(id: string, values: ProjectFormValues): Promise<ActionResult<{ id: string }>> {
  try {
    await requireRole("pm")
    const parsedId = projectIdSchema.safeParse(id)
    if (!parsedId.success) return fail("Proyecto inválido.")
    const parsed = projectFormSchema.safeParse(values)
    if (!parsed.success) return fromZodError(parsed.error)

    const { title, description, dueDate, assignedTo } = parsed.data
    const supabase = await createClient()
    if (!(await assertDesigners(supabase, assignedTo))) {
      return fail("Alguno de los asignados no es diseñador.", { assignedTo: ["Revisá la selección."] })
    }

    const { data, error } = await supabase
      .from("projects")
      .update({ title, description: description || null, due_date: dueDate || null, assigned_to: assignedTo })
      .eq("id", parsedId.data)
      .select("id")
      .maybeSingle()

    if (error) return fail(describeDbError(error))
    if (!data) return fail("No encontramos el proyecto o no tenés permiso para editarlo.")
    revalidateProject(data.id)
    return ok({ id: data.id })
  } catch (error) {
    return handleActionError(error)
  }
}

export async function updateProjectStatus(id: string, status: ProjectStatus): Promise<ActionResult> {
  try {
    await requireRole("pm", "designer")
    const parsedId = projectIdSchema.safeParse(id)
    const parsedStatus = projectStatusSchema.safeParse(status)
    if (!parsedId.success || !parsedStatus.success) return fail("Estado inválido.")

    const supabase = await createClient()
    // RLS limita al diseñador a sus asignados; el trigger, a tocar solo el estado.
    const { data, error } = await supabase
      .from("projects")
      .update({ status: parsedStatus.data })
      .eq("id", parsedId.data)
      .select("id")
      .maybeSingle()

    if (error) return fail(describeDbError(error))
    if (!data) return fail("No tenés permiso para cambiar el estado de este proyecto.")
    revalidateProject(data.id)
    return ok(undefined)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function assignDesigners(id: string, designerIds: string[]): Promise<ActionResult> {
  try {
    await requireRole("pm")
    const parsedId = projectIdSchema.safeParse(id)
    const parsedIds = projectFormSchema.shape.assignedTo.safeParse(designerIds)
    if (!parsedId.success || !parsedIds.success) return fail("Selección inválida.")

    const supabase = await createClient()
    if (!(await assertDesigners(supabase, parsedIds.data))) return fail("Alguno de los asignados no es diseñador.")

    const { data, error } = await supabase
      .from("projects")
      .update({ assigned_to: parsedIds.data })
      .eq("id", parsedId.data)
      .select("id")
      .maybeSingle()

    if (error) return fail(describeDbError(error))
    if (!data) return fail("No encontramos el proyecto.")
    revalidateProject(data.id)
    return ok(undefined)
  } catch (error) {
    return handleActionError(error)
  }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  try {
    await requireRole("pm")
    const parsedId = projectIdSchema.safeParse(id)
    if (!parsedId.success) return fail("Proyecto inválido.")

    const supabase = await createClient()

    // Primero los objetos de Storage (la fila de metadatos cae en cascada).
    const { data: files } = await supabase.from("project_files").select("path").eq("project_id", parsedId.data)
    if (files && files.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("project-files")
        .remove(files.map((f) => f.path))
      if (storageError) return fail("No pudimos borrar los archivos del proyecto. Probá de nuevo.")
    }

    const { data, error } = await supabase
      .from("projects")
      .delete()
      .eq("id", parsedId.data)
      .select("id")
      .maybeSingle()

    if (error) return fail(describeDbError(error))
    if (!data) return fail("No encontramos el proyecto o no tenés permiso para borrarlo.")
    revalidateProject()
    return ok(undefined)
  } catch (error) {
    return handleActionError(error)
  }
}
