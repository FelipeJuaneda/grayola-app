import { Paperclip } from "lucide-react"
import Link from "next/link"

import { AvatarStack } from "@/components/ui/misc"
import type { ProjectListItem } from "@/features/projects/queries"
import type { Role } from "@/lib/auth/session"
import { describeDue, dueState } from "@/lib/format"
import { cn } from "@/lib/utils"

import { StatusLabel, StatusTrack } from "./status"
import { StatusControl } from "./status-control"

const dueTone = {
  overdue: "font-semibold text-danger",
  soon: "font-semibold text-signal-review-ink",
  ok: "text-ink",
  none: "text-ink-2",
} as const

// Índice numerado a bandera izquierda. En mobile cada fila se apila; desde
// md las columnas se alinean a la grilla con encabezados.
export function ProjectTable({ projects, role }: { projects: ProjectListItem[]; role: Role }) {
  const canChangeStatus = role === "pm" || role === "designer"
  const showClient = role !== "client"

  return (
    <div role="table" aria-label="Proyectos" className="border-t-2 border-rule-strong">
      <div
        role="row"
        className="hidden grid-cols-[3rem_minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] gap-4 border-b border-rule py-2.5 lg:grid"
      >
        {["N.º", "Proyecto", "Estado", showClient ? "Cliente" : "Equipo", showClient ? "Equipo" : "Archivos", "Entrega"].map(
          (label) => (
            <span key={label} role="columnheader" className="kicker">
              {label}
            </span>
          ),
        )}
      </div>

      <div role="rowgroup">
        {projects.map((project, index) => {
          const due = dueState(project.dueDate, project.status === "delivered")
          const teamNames = project.assignees.map((a) => a.name)
          return (
            <div
              key={project.id}
              role="row"
              className={cn(
                "group relative grid grid-cols-[2.25rem_minmax(0,1fr)] gap-x-3 gap-y-2 border-b border-rule py-4",
                "lg:grid-cols-[3rem_minmax(0,2.4fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] lg:items-center lg:gap-4",
                "motion-safe:animate-rise",
              )}
              style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
            >
              <span role="cell" className="numeral row-span-5 text-h3 text-ink-2 lg:row-span-1 lg:text-lead">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div role="cell" className="min-w-0">
                <Link
                  href={`/proyectos/${project.id}`}
                  className="text-lead font-bold leading-snug text-ink underline-offset-4 decoration-2 hover:underline"
                >
                  {project.title}
                </Link>
                {project.description ? (
                  <p className="mt-0.5 line-clamp-1 text-small text-ink-2">{project.description}</p>
                ) : null}
                {role === "client" ? <StatusTrack status={project.status} className="mt-3 max-w-56" /> : null}
              </div>

              <div role="cell">
                {canChangeStatus ? (
                  <StatusControl projectId={project.id} projectTitle={project.title} status={project.status} />
                ) : (
                  <StatusLabel status={project.status} />
                )}
              </div>

              <div role="cell" className="flex min-w-0 items-center gap-2 text-small">
                {showClient ? (
                  <span className="truncate">
                    <span className="text-ink-2 lg:sr-only">Cliente: </span>
                    {project.client?.name ?? "—"}
                  </span>
                ) : teamNames.length > 0 ? (
                  <>
                    <AvatarStack names={teamNames} />
                    <span className="truncate text-ink-2">{teamNames.join(", ")}</span>
                  </>
                ) : (
                  <span className="text-ink-2">Esperando asignación</span>
                )}
              </div>

              <div role="cell" className="flex min-w-0 items-center gap-2 text-small">
                {showClient ? (
                  teamNames.length > 0 ? (
                    <>
                      <AvatarStack names={teamNames} />
                      <span className="sr-only">Equipo: {teamNames.join(", ")}</span>
                    </>
                  ) : (
                    <span className="font-semibold text-signal-review-ink">Sin asignar</span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-ink-2">
                    <Paperclip aria-hidden="true" className="size-3.5" />
                    {project.fileCount} {project.fileCount === 1 ? "archivo" : "archivos"}
                  </span>
                )}
              </div>

              <div role="cell" className={cn("text-small tabular", dueTone[due])}>
                <span className="text-ink-2 lg:sr-only">Entrega: </span>
                {describeDue(project.dueDate, project.status === "delivered")}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
