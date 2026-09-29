import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"

import { ProjectForm } from "@/components/projects/project-form"
import { getProject, listDesigners } from "@/features/projects/queries"
import { projectIdSchema } from "@/features/projects/schemas"
import { requireUser } from "@/lib/auth/session"

export const metadata: Metadata = { title: "Editar proyecto" }

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!projectIdSchema.safeParse(id).success) notFound()

  const user = await requireUser()
  // Solo el PM edita; el servidor y RLS lo vuelven a verificar al guardar.
  if (user.role !== "pm") redirect(`/proyectos/${id}`)

  const [project, designers] = await Promise.all([getProject(id), listDesigners()])

  return (
    <div className="container-swiss grid max-w-5xl gap-8 pt-8">
      <Link
        href={`/proyectos/${project.id}`}
        className="inline-flex w-fit items-center gap-2 text-small font-semibold text-ink-2 hover:text-ink"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Volver al proyecto
      </Link>
      <header className="grid gap-2">
        <p className="kicker">Editar proyecto</p>
        <h1 className="text-h1 font-bold tracking-[-0.02em] md:text-display">{project.title}</h1>
      </header>
      <ProjectForm
        mode="edit"
        role={user.role}
        designers={designers}
        projectId={project.id}
        defaultValues={{
          title: project.title,
          description: project.description ?? "",
          dueDate: project.dueDate ?? "",
          assignedTo: project.assignees.map((a) => a.id),
        }}
      />
    </div>
  )
}
