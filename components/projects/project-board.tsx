import Link from "next/link"

import { AvatarStack } from "@/components/ui/misc"
import { PROJECT_STATUSES, STATUS_META } from "@/features/projects/constants"
import type { ProjectListItem } from "@/features/projects/queries"
import { describeDue, dueState } from "@/lib/format"
import { cn } from "@/lib/utils"

import { StatusMarker } from "./status"
import { StatusControl } from "./status-control"

// Tablero por estado: columnas separadas por filetes, no cajas dentro de cajas.
// En pantallas chicas las columnas se desplazan en horizontal con snap.
export function ProjectBoard({ projects }: { projects: ProjectListItem[] }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      <div className="grid min-w-[56rem] snap-x snap-mandatory grid-cols-4 gap-0 border-t-2 border-rule-strong md:min-w-0">
        {PROJECT_STATUSES.map((status) => {
          const column = projects.filter((p) => p.status === status)
          return (
            <section
              key={status}
              aria-labelledby={`col-${status}`}
              className="snap-start border-r border-rule px-4 first:pl-0 last:border-r-0 last:pr-0"
            >
              <header className="flex items-center justify-between border-b border-rule py-3">
                <h3 id={`col-${status}`} className="flex items-center gap-2 text-small font-bold">
                  <StatusMarker status={status} />
                  {STATUS_META[status].label}
                </h3>
                <span className="numeral text-lead text-ink-2" aria-label={`${column.length} proyectos`}>
                  {String(column.length).padStart(2, "0")}
                </span>
              </header>

              {column.length === 0 ? (
                <p className="border-b border-dashed border-rule py-6 text-small text-ink-2">Nada en esta etapa.</p>
              ) : (
                <ul>
                  {column.map((project) => {
                    const due = dueState(project.dueDate, project.status === "delivered")
                    return (
                      <li key={project.id} className="grid gap-2 border-b border-rule py-4">
                        <Link
                          href={`/proyectos/${project.id}`}
                          className="leading-snug font-bold decoration-2 underline-offset-4 hover:underline"
                        >
                          {project.title}
                        </Link>
                        <p className="text-small text-ink-2">{project.client?.name ?? "—"}</p>
                        <div className="flex items-center justify-between gap-2">
                          {project.assignees.length > 0 ? (
                            <AvatarStack names={project.assignees.map((a) => a.name)} />
                          ) : (
                            <span className="text-caption font-semibold text-signal-review-ink">Sin asignar</span>
                          )}
                          <span
                            className={cn(
                              "tabular text-caption",
                              due === "overdue" ? "font-semibold text-danger" : "text-ink-2",
                            )}
                          >
                            {describeDue(project.dueDate, project.status === "delivered")}
                          </span>
                        </div>
                        <StatusControl projectId={project.id} projectTitle={project.title} status={project.status} />
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
