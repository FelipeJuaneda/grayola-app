import { Check } from "lucide-react"

import {
  PROJECT_STATUSES,
  type ProjectStatus,
  STATUS_META,
  statusIndex,
} from "@/features/projects/constants"
import { cn } from "@/lib/utils"

// Cada estado se reconoce por forma además de color: contorno (pendiente),
// lleno (en progreso), rayado (en revisión) y lleno con tilde (entregado).
const markerShape: Record<ProjectStatus, string> = {
  pending: "border-2 border-signal-pending",
  in_progress: "bg-signal-progress",
  in_review:
    "border-[1.5px] border-signal-review bg-[repeating-linear-gradient(45deg,var(--signal-review)_0_1.5px,transparent_1.5px_4px)]",
  delivered: "bg-signal-done text-paper",
}

export function StatusMarker({ status, className }: { status: ProjectStatus; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex size-3 shrink-0 items-center justify-center", markerShape[status], className)}
    >
      {status === "delivered" ? <Check className="size-2.5" strokeWidth={4} /> : null}
    </span>
  )
}

export function StatusLabel({ status, className }: { status: ProjectStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-small font-medium text-ink", className)}>
      <StatusMarker status={status} />
      {STATUS_META[status].label}
    </span>
  )
}

const cellColor: Record<ProjectStatus, string> = {
  pending: "bg-signal-pending",
  in_progress: "bg-signal-progress",
  in_review: "bg-signal-review",
  delivered: "bg-signal-done",
}

// Las 4 etapas como celdas: las alcanzadas se encienden con el color del
// estado actual; las que faltan quedan "apagadas".
export function StatusTrack({ status, className }: { status: ProjectStatus; className?: string }) {
  const current = statusIndex(status)
  return (
    <div className={cn("grid gap-1.5", className)}>
      <div className="grid grid-cols-4 gap-1" aria-hidden="true">
        {PROJECT_STATUSES.map((step, index) => (
          <span
            key={step}
            className={cn(
              "h-1.5",
              index <= current ? cellColor[status] : "border border-dashed border-ink-3 bg-transparent",
            )}
          />
        ))}
      </div>
      <p className="sr-only">
        Etapa {current + 1} de {PROJECT_STATUSES.length}: {STATUS_META[status].label}
      </p>
    </div>
  )
}

export function StatusSteps({ status }: { status: ProjectStatus }) {
  const current = statusIndex(status)
  return (
    <ol className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4" aria-label="Etapas del proyecto">
      {PROJECT_STATUSES.map((step, index) => {
        const reached = index <= current
        return (
          <li
            key={step}
            aria-current={index === current ? "step" : undefined}
            className={cn("grid gap-2 border-t-4 pt-2", reached ? "border-rule-strong" : "border-rule")}
          >
            <span className={cn("flex items-center gap-2 text-small font-semibold", !reached && "text-ink-2")}>
              {reached ? <StatusMarker status={step} /> : <span aria-hidden="true" className="size-3 border border-dashed border-ink-3" />}
              {STATUS_META[step].label}
            </span>
            <span className="text-caption text-ink-2">{STATUS_META[step].hint}</span>
          </li>
        )
      })}
    </ol>
  )
}
