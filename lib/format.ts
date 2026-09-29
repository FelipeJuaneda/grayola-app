import { differenceInCalendarDays, format, formatDistanceToNowStrict, parseISO } from "date-fns"
import { es } from "date-fns/locale"

// due_date es un `date` sin hora: se interpreta en horario local.
export function parseDateOnly(value: string) {
  return parseISO(`${value}T00:00:00`)
}

export function formatShortDate(value: string) {
  return format(parseDateOnly(value), "d MMM", { locale: es })
}

export function formatLongDate(value: string) {
  return format(parseISO(value), "d 'de' MMMM, HH:mm", { locale: es })
}

export function formatRelative(value: string) {
  return formatDistanceToNowStrict(parseISO(value), { addSuffix: true, locale: es })
}

export type DueState = "overdue" | "soon" | "ok" | "none"

export function dueState(dueDate: string | null, delivered: boolean): DueState {
  if (!dueDate || delivered) return "none"
  const days = differenceInCalendarDays(parseDateOnly(dueDate), new Date())
  if (days < 0) return "overdue"
  if (days <= 3) return "soon"
  return "ok"
}

export function describeDue(dueDate: string | null, delivered: boolean) {
  if (!dueDate) return "Sin fecha"
  if (delivered) return formatShortDate(dueDate)
  const days = differenceInCalendarDays(parseDateOnly(dueDate), new Date())
  if (days < -1) return `Vencido hace ${Math.abs(days)} días`
  if (days === -1) return "Venció ayer"
  if (days === 0) return "Vence hoy"
  if (days === 1) return "Vence mañana"
  if (days <= 7) return `En ${days} días`
  return formatShortDate(dueDate)
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`
}

export function initials(name: string | null | undefined, fallback = "?") {
  if (!name) return fallback
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ""
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? "") : ""
  return (first + last).toUpperCase() || fallback
}
