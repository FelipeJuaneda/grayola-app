import { Constants, type Enums } from "@/types/database"

export type ProjectStatus = Enums<"project_status">
export type ProjectEventType = Enums<"project_event_type">

export const PROJECT_STATUSES = Constants.public.Enums.project_status

export const STATUS_META: Record<ProjectStatus, { label: string; hint: string }> = {
  pending: { label: "Pendiente", hint: "Todavía no empezó" },
  in_progress: { label: "En progreso", hint: "El equipo está trabajando" },
  in_review: { label: "En revisión", hint: "Listo para revisar" },
  delivered: { label: "Entregado", hint: "Trabajo terminado" },
}

export function statusIndex(status: ProjectStatus) {
  return PROJECT_STATUSES.indexOf(status)
}

export const PROJECT_VIEWS = ["list", "board"] as const
export type ProjectView = (typeof PROJECT_VIEWS)[number]

export const PROJECT_SORTS = ["recent", "due"] as const
export type ProjectSort = (typeof PROJECT_SORTS)[number]
