import { ArrowLeft, Pencil } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { FileManager } from "@/components/files/file-manager"
import { ActivityTimeline } from "@/components/projects/activity-timeline"
import { DeleteProjectButton } from "@/components/projects/delete-project-button"
import { StatusSteps } from "@/components/projects/status"
import { StatusControl } from "@/components/projects/status-control"
import { buttonVariants } from "@/components/ui/button"
import { Avatar } from "@/components/ui/misc"
import { getProject } from "@/features/projects/queries"
import { projectIdSchema } from "@/features/projects/schemas"
import { requireUser } from "@/lib/auth/session"
import { describeDue, dueState, formatLongDate, formatRelative } from "@/lib/format"
import { cn } from "@/lib/utils"

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params
  if (!projectIdSchema.safeParse(id).success) return { title: "Proyecto" }
  const project = await getProject(id)
  return { title: project.title }
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5 border-t border-rule py-4">
      <dt className="kicker">{label}</dt>
      <dd className="text-body">{children}</dd>
    </div>
  )
}

export default async function ProjectPage({ params }: Params) {
  const { id } = await params
  if (!projectIdSchema.safeParse(id).success) notFound()

  const [user, project] = await Promise.all([requireUser(), getProject(id)])
  const isPm = user.role === "pm"
  const canChangeStatus = isPm || user.role === "designer"
  const canUpload = isPm || (user.role === "client" && project.client?.id === user.id)
  const delivered = project.status === "delivered"
  const due = dueState(project.dueDate, delivered)

  return (
    <article className="container-swiss grid gap-10 pt-8">
      <Link href="/proyectos" className="inline-flex w-fit items-center gap-2 text-small font-semibold text-ink-2 hover:text-ink">
        <ArrowLeft aria-hidden="true" className="size-4" />
        Proyectos
      </Link>

      <header className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <div className="grid gap-3">
          <p className="kicker">
            Pedido de {project.client?.name ?? "un cliente"} ·{" "}
            <time dateTime={project.createdAt} title={formatLongDate(project.createdAt)}>
              {formatRelative(project.createdAt)}
            </time>
          </p>
          <h1 className="max-w-4xl text-h1 font-bold tracking-[-0.02em] md:text-display">{project.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {canChangeStatus ? (
            <StatusControl projectId={project.id} projectTitle={project.title} status={project.status} />
          ) : null}
          {isPm ? (
            <>
              <Link href={`/proyectos/${project.id}/editar`} className={buttonVariants({ variant: "secondary" })}>
                <Pencil aria-hidden="true" />
                Editar
              </Link>
              <DeleteProjectButton projectId={project.id} title={project.title} fileCount={project.files.length} />
            </>
          ) : null}
        </div>
      </header>

      <StatusSteps status={project.status} />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
        <div className="grid content-start gap-12">
          <section aria-labelledby="brief" className="grid gap-4 border-t-2 border-rule-strong pt-5">
            <h2 id="brief" className="text-lead font-bold">
              Descripción
            </h2>
            {project.description ? (
              <p className="max-w-[68ch] text-lead leading-relaxed whitespace-pre-line">{project.description}</p>
            ) : (
              <p className="text-body text-ink-2">Este proyecto no tiene descripción.</p>
            )}
          </section>

          <section aria-labelledby="archivos" className="grid gap-4 border-t-2 border-rule-strong pt-5">
            <h2 id="archivos" className="flex items-baseline justify-between text-lead font-bold">
              Archivos
              <span className="text-small font-normal text-ink-2">
                {project.files.length} {project.files.length === 1 ? "archivo" : "archivos"} · privados
              </span>
            </h2>
            <FileManager projectId={project.id} files={project.files} canUpload={canUpload} canDelete={isPm} />
          </section>
        </div>

        <aside className="grid content-start gap-12">
          <dl className="grid border-b border-rule">
            <Meta label="Cliente">{project.client?.name ?? "—"}</Meta>
            <Meta label="Equipo">
              {project.assignees.length > 0 ? (
                <ul className="grid gap-2">
                  {project.assignees.map((person) => (
                    <li key={person.id} className="flex items-center gap-2.5">
                      <Avatar name={person.name} size="sm" />
                      {person.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="font-semibold text-signal-review-ink">
                  Sin asignar{isPm ? " · asignalo desde Editar" : ""}
                </span>
              )}
            </Meta>
            <Meta label="Entrega">
              <span
                className={cn(
                  "tabular",
                  due === "overdue" && "font-semibold text-danger",
                  due === "soon" && "font-semibold text-signal-review-ink",
                )}
              >
                {describeDue(project.dueDate, delivered)}
              </span>
            </Meta>
            <Meta label="Última actualización">
              <time dateTime={project.updatedAt} title={formatLongDate(project.updatedAt)}>
                {formatRelative(project.updatedAt)}
              </time>
            </Meta>
          </dl>

          <section aria-labelledby="actividad" className="grid gap-5">
            <h2 id="actividad" className="text-lead font-bold">
              Actividad
            </h2>
            <ActivityTimeline events={project.events} />
          </section>
        </aside>
      </div>
    </article>
  )
}
