import "server-only"

import { notFound } from "next/navigation"
import { cache } from "react"

import { createClient } from "@/lib/supabase/server"
import type { Json } from "@/types/database"

import type { ProjectEventType, ProjectStatus } from "./constants"
import type { ProjectFilters } from "./schemas"

type Supabase = Awaited<ReturnType<typeof createClient>>

export type Person = { id: string; name: string; email: string | null }

export type ProjectListItem = {
  id: string
  title: string
  description: string | null
  status: ProjectStatus
  dueDate: string | null
  createdAt: string
  updatedAt: string
  client: Person | null
  assignees: Person[]
  fileCount: number
}

export type ProjectFile = {
  id: string
  name: string
  size: number
  mimeType: string
  createdAt: string
  uploadedBy: Person | null
  previewUrl: string | null
}

export type ProjectEvent = {
  id: number
  type: ProjectEventType
  payload: Json
  createdAt: string
  actor: Person | null
  people: Person[]
}

export type ProjectDetail = ProjectListItem & {
  files: ProjectFile[]
  events: ProjectEvent[]
}

const UNKNOWN_PERSON = "Usuario"

// RLS solo deja ver los perfiles que comparten proyecto con quien consulta
// (o todos, si es PM), así que esto nunca expone a terceros.
async function loadPeople(supabase: Supabase, ids: Iterable<string>) {
  const unique = [...new Set(ids)].filter(Boolean)
  const people = new Map<string, Person>()
  if (unique.length === 0) return people

  const { data } = await supabase.from("profiles").select("id, full_name, email").in("id", unique)
  for (const row of data ?? []) {
    people.set(row.id, { id: row.id, name: row.full_name ?? row.email ?? UNKNOWN_PERSON, email: row.email })
  }
  return people
}

// Quita caracteres que PostgREST interpreta en filtros `or`/`ilike`.
function sanitizeSearch(term: string) {
  return term.replace(/[%_,()\\*]/g, " ").trim()
}

const LIST_COLUMNS =
  "id, title, description, status, due_date, created_at, updated_at, created_by, assigned_to, project_files(count)"

// La visibilidad por rol la resuelve RLS: el cliente recibe sus proyectos,
// el diseñador los asignados y el PM todos, sin filtrar por rol acá.
export async function listProjects(filters: Partial<ProjectFilters> = {}): Promise<ProjectListItem[]> {
  const supabase = await createClient()
  let query = supabase.from("projects").select(LIST_COLUMNS)

  if (filters.status) query = query.eq("status", filters.status)
  if (filters.designer) query = query.contains("assigned_to", [filters.designer])
  if (filters.q) {
    const term = sanitizeSearch(filters.q)
    if (term) query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`)
  }

  query =
    filters.sort === "due"
      ? query.order("due_date", { ascending: true, nullsFirst: false }).order("created_at", { ascending: false })
      : query.order("created_at", { ascending: false })

  const { data, error } = await query
  if (error) throw new Error(`No se pudieron cargar los proyectos: ${error.message}`)

  const people = await loadPeople(
    supabase,
    data.flatMap((row) => [row.created_by, ...row.assigned_to]),
  )

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    client: people.get(row.created_by) ?? null,
    assignees: row.assigned_to.map((id) => people.get(id)).filter((p): p is Person => Boolean(p)),
    fileCount: row.project_files[0]?.count ?? 0,
  }))
}

const PREVIEWABLE = /^image\/(png|jpe?g|webp|gif)$/

function idsInPayload(payload: Json): string[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return []
  const ids: string[] = []
  for (const key of ["added", "removed"]) {
    const value = payload[key]
    if (Array.isArray(value)) ids.push(...value.filter((v): v is string => typeof v === "string"))
  }
  return ids
}

export const getProject = cache(async (id: string): Promise<ProjectDetail> => {
  const supabase = await createClient()

  const { data: row, error } = await supabase.from("projects").select(LIST_COLUMNS).eq("id", id).maybeSingle()
  if (error || !row) notFound()

  const [{ data: files }, { data: events }] = await Promise.all([
    supabase
      .from("project_files")
      .select("id, name, size, mime_type, path, created_at, uploaded_by")
      .eq("project_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("project_events")
      .select("id, type, payload, created_at, actor_id")
      .eq("project_id", id)
      .order("created_at", { ascending: false })
      .limit(50),
  ])

  const people = await loadPeople(supabase, [
    row.created_by,
    ...row.assigned_to,
    ...(files ?? []).map((f) => f.uploaded_by),
    ...(events ?? []).flatMap((e) => [e.actor_id ?? "", ...idsInPayload(e.payload)]),
  ])

  // URLs firmadas de 1 h para miniaturas; las descargas piden su propia URL.
  const previewPaths = (files ?? []).filter((f) => PREVIEWABLE.test(f.mime_type)).map((f) => f.path)
  const previews = new Map<string, string>()
  if (previewPaths.length > 0) {
    const { data: signed } = await supabase.storage.from("project-files").createSignedUrls(previewPaths, 3600)
    for (const item of signed ?? []) {
      if (item.path && item.signedUrl) previews.set(item.path, item.signedUrl)
    }
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    client: people.get(row.created_by) ?? null,
    assignees: row.assigned_to.map((pid) => people.get(pid)).filter((p): p is Person => Boolean(p)),
    fileCount: row.project_files[0]?.count ?? 0,
    files: (files ?? []).map((f) => ({
      id: f.id,
      name: f.name,
      size: f.size,
      mimeType: f.mime_type,
      createdAt: f.created_at,
      uploadedBy: people.get(f.uploaded_by) ?? null,
      previewUrl: previews.get(f.path) ?? null,
    })),
    events: (events ?? []).map((e) => ({
      id: e.id,
      type: e.type,
      payload: e.payload,
      createdAt: e.created_at,
      actor: e.actor_id ? (people.get(e.actor_id) ?? null) : null,
      people: idsInPayload(e.payload)
        .map((pid) => people.get(pid))
        .filter((p): p is Person => Boolean(p)),
    })),
  }
})

// Solo el PM ve a todos los diseñadores (RLS); al resto le devuelve los que
// comparten proyecto, que es justo lo que necesita un filtro.
export async function listDesigners(): Promise<Person[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "designer")
    .order("full_name")
  if (error) throw new Error(`No se pudieron cargar los diseñadores: ${error.message}`)
  return data.map((d) => ({ id: d.id, name: d.full_name ?? d.email ?? UNKNOWN_PERSON, email: d.email }))
}
