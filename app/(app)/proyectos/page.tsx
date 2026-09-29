import { Plus } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { ParticleBackdrop } from "@/components/particles/particle-backdrop"
import { EmptyState } from "@/components/projects/empty-state"
import { ProjectBoard } from "@/components/projects/project-board"
import { ProjectFilters } from "@/components/projects/project-filters"
import { ProjectTable } from "@/components/projects/project-table"
import { StatCounters } from "@/components/projects/stat-counters"
import { buttonVariants } from "@/components/ui/button"
import { listDesigners, listProjects } from "@/features/projects/queries"
import { projectFiltersSchema } from "@/features/projects/schemas"
import { requireUser } from "@/lib/auth/session"
import { DASHBOARD_COPY, firstName } from "@/lib/roles"

export const metadata: Metadata = { title: "Proyectos" }

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const user = await requireUser()
  const raw = await searchParams
  const filters = projectFiltersSchema.parse(raw)
  const isPm = user.role === "pm"
  const canCreate = user.role === "client" || user.role === "pm"
  // El diseñador ve primero lo que vence antes.
  const sort = user.role === "designer" && !raw.sort ? "due" : filters.sort
  const view = isPm ? filters.view : "list"
  const hasFilters = Boolean(filters.q || filters.status || filters.designer)

  const [all, fetched, designers] = await Promise.all([
    listProjects({}),
    listProjects({ ...filters, sort }),
    isPm ? listDesigners() : Promise.resolve([]),
  ])
  // Ordenado por entrega, lo ya entregado baja al final: arriba queda lo urgente.
  const filtered =
    sort === "due"
      ? [...fetched].sort((a, b) => Number(a.status === "delivered") - Number(b.status === "delivered"))
      : fetched

  const copy = DASHBOARD_COPY[user.role]
  const name = firstName(user.fullName, user.email)
  const createLabel = user.role === "client" ? "Nuevo pedido" : "Nuevo proyecto"

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-rule">
        <ParticleBackdrop
          intensity="ambient"
          className="[mask-image:linear-gradient(to_right,transparent_35%,black_85%)]"
        />
        <div className="container-swiss relative grid gap-6 py-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:py-14">
          <div className="grid max-w-2xl gap-3">
            <p className="kicker">{copy.kicker}</p>
            <h1 className="text-h1 font-bold tracking-[-0.02em] md:text-display">{copy.title(name)}</h1>
            <p className="text-lead text-ink-2">{copy.lead}</p>
          </div>
          {canCreate ? (
            <Link href="/proyectos/nuevo" className={buttonVariants()}>
              <Plus aria-hidden="true" />
              {createLabel}
            </Link>
          ) : null}
        </div>
      </section>

      <div className="container-swiss grid gap-12 pt-10">
        {all.length === 0 ? (
          <EmptyState
            title={user.role === "designer" ? "Todavía no tenés proyectos asignados" : "Empezá tu primer proyecto"}
            description={
              user.role === "designer"
                ? "Cuando el PM te asigne un proyecto, lo vas a ver acá ordenado por fecha de entrega."
                : "Contanos qué necesitás diseñar, adjuntá referencias y seguí cada etapa hasta la entrega."
            }
            action={
              canCreate ? (
                <Link href="/proyectos/nuevo" className={buttonVariants()}>
                  <Plus aria-hidden="true" />
                  {createLabel}
                </Link>
              ) : null
            }
          />
        ) : (
          <>
            <StatCounters projects={all} activeStatus={filters.status} />

            <section aria-labelledby="listado" className="grid gap-6">
              <h2 id="listado" className="sr-only">
                Listado de proyectos
              </h2>
              <Suspense>
                <ProjectFilters
                  designers={designers}
                  showDesigner={isPm}
                  showView={isPm}
                  defaultSort={user.role === "designer" ? "due" : "recent"}
                />
              </Suspense>

              <p className="text-small text-ink-2" aria-live="polite">
                {filtered.length === all.length
                  ? `${all.length} ${all.length === 1 ? "proyecto" : "proyectos"}`
                  : `${filtered.length} de ${all.length} proyectos`}
              </p>

              {filtered.length === 0 ? (
                <EmptyState
                  title="Ningún proyecto coincide"
                  description={
                    hasFilters
                      ? "Probá con otra búsqueda o limpiá los filtros para ver todo."
                      : "No hay proyectos en esta vista."
                  }
                  action={
                    <Link href="/proyectos" className={buttonVariants({ variant: "secondary" })}>
                      Ver todos
                    </Link>
                  }
                />
              ) : view === "board" ? (
                <ProjectBoard projects={filtered} />
              ) : (
                <ProjectTable projects={filtered} role={user.role} />
              )}
            </section>
          </>
        )}
      </div>
    </>
  )
}
