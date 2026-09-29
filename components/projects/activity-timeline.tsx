import { STATUS_META, type ProjectStatus } from "@/features/projects/constants"
import type { ProjectEvent } from "@/features/projects/queries"
import { formatLongDate, formatRelative, formatShortDate } from "@/lib/format"

import { StatusMarker } from "./status"

function payloadValue(payload: ProjectEvent["payload"], key: string) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return null
  const value = payload[key]
  return typeof value === "string" ? value : null
}

function describe(event: ProjectEvent) {
  const who = event.actor?.name ?? "Alguien"
  switch (event.type) {
    case "created":
      return <><strong>{who}</strong> creó el proyecto</>
    case "status_changed": {
      const to = payloadValue(event.payload, "to") as ProjectStatus | null
      return (
        <>
          <strong>{who}</strong> movió el proyecto a{" "}
          {to ? (
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <StatusMarker status={to} className="size-2.5" />
              {STATUS_META[to].label}
            </span>
          ) : (
            "otro estado"
          )}
        </>
      )
    }
    case "assignees_changed": {
      const names = event.people.map((p) => p.name)
      return names.length > 0 ? (
        <><strong>{who}</strong> actualizó el equipo: {names.join(", ")}</>
      ) : (
        <><strong>{who}</strong> actualizó el equipo</>
      )
    }
    case "due_date_changed": {
      const to = payloadValue(event.payload, "to")
      return to ? (
        <><strong>{who}</strong> fijó la entrega para el {formatShortDate(to)}</>
      ) : (
        <><strong>{who}</strong> quitó la fecha de entrega</>
      )
    }
    case "details_updated":
      return <><strong>{who}</strong> editó el título o la descripción</>
    case "file_added":
      return <><strong>{who}</strong> subió {payloadValue(event.payload, "name") ?? "un archivo"}</>
    case "file_removed":
      return <><strong>{who}</strong> eliminó {payloadValue(event.payload, "name") ?? "un archivo"}</>
  }
}

// Historial escrito por la base (triggers), nunca por el cliente.
export function ActivityTimeline({ events }: { events: ProjectEvent[] }) {
  if (events.length === 0) {
    return <p className="text-small text-ink-2">Todavía no hay actividad.</p>
  }

  return (
    <ol className="grid">
      {events.map((event) => (
        <li key={event.id} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-3 pb-5 last:pb-0">
          <span aria-hidden="true" className="relative flex justify-center">
            <span className="mt-1.5 size-2 bg-ink" />
            <span className="absolute top-4 bottom-[-0.25rem] w-px bg-rule" />
          </span>
          <div className="grid gap-0.5">
            <p className="text-small [&_strong]:font-semibold">{describe(event)}</p>
            <time dateTime={event.createdAt} title={formatLongDate(event.createdAt)} className="text-caption text-ink-2">
              {formatRelative(event.createdAt)}
            </time>
          </div>
        </li>
      ))}
    </ol>
  )
}
