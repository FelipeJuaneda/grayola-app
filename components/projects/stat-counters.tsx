import Link from "next/link"

import { PROJECT_STATUSES, type ProjectStatus, STATUS_META } from "@/features/projects/constants"
import type { ProjectListItem } from "@/features/projects/queries"
import { dueState } from "@/lib/format"
import { cn } from "@/lib/utils"

const ruleColor: Record<ProjectStatus, string> = {
  pending: "border-signal-pending",
  in_progress: "border-signal-progress",
  in_review: "border-signal-review border-dashed",
  delivered: "border-signal-done",
}

export function countProjects(projects: ProjectListItem[]) {
  const counts = Object.fromEntries(PROJECT_STATUSES.map((s) => [s, 0])) as Record<ProjectStatus, number>
  let overdue = 0
  let unassigned = 0
  for (const project of projects) {
    counts[project.status] += 1
    if (dueState(project.dueDate, project.status === "delivered") === "overdue") overdue += 1
    if (project.assignees.length === 0 && project.status !== "delivered") unassigned += 1
  }
  return { counts, overdue, unassigned, total: projects.length }
}

// Contadores de cartel: numerales grandes sobre la grilla. En cero quedan
// "apagados" (la ausencia también se diseña). Cada uno filtra la lista.
export function StatCounters({
  projects,
  activeStatus,
}: {
  projects: ProjectListItem[]
  activeStatus?: ProjectStatus
}) {
  const { counts, overdue } = countProjects(projects)

  const items = [
    ...PROJECT_STATUSES.map((status) => ({
      key: status,
      href: `/proyectos?status=${status}`,
      value: counts[status],
      label: STATUS_META[status].label,
      rule: ruleColor[status],
      active: activeStatus === status,
    })),
    {
      key: "overdue",
      href: "/proyectos?sort=due",
      value: overdue,
      label: "Vencidos",
      rule: "border-danger",
      active: false,
    },
  ]

  return (
    <nav aria-label="Resumen por estado">
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <li key={item.key}>
            <Link
              href={item.href}
              aria-current={item.active ? "true" : undefined}
              className="group block focus-visible:outline-offset-4"
            >
              <span
                className={cn(
                  "numeral tabular block text-display sm:text-numeral",
                  item.value === 0 ? "text-ink-3" : "text-ink",
                )}
              >
                {String(item.value).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "mt-3 flex items-center justify-between border-t-[3px] pt-2 text-small font-semibold",
                  item.value === 0 ? "border-rule" : item.rule,
                  item.active && "underline decoration-2 underline-offset-4",
                )}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className="text-ink-2 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5 motion-reduce:transition-none"
                >
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
