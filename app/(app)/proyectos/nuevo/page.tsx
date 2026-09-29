import { ArrowLeft } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"

import { ProjectForm } from "@/components/projects/project-form"
import { listDesigners } from "@/features/projects/queries"
import { requireUser } from "@/lib/auth/session"

export const metadata: Metadata = { title: "Nuevo proyecto" }

export default async function NewProjectPage() {
  const user = await requireUser()
  // Los diseñadores no crean proyectos (la acción del servidor también lo rechaza).
  if (user.role === "designer") redirect("/proyectos")

  const designers = user.role === "pm" ? await listDesigners() : []
  const isClient = user.role === "client"

  return (
    <div className="container-swiss grid max-w-5xl gap-8 pt-8">
      <Link
        href="/proyectos"
        className="inline-flex w-fit items-center gap-2 text-small font-semibold text-ink-2 hover:text-ink"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Proyectos
      </Link>
      <header className="grid gap-2">
        <p className="kicker">{isClient ? "Nuevo pedido" : "Nuevo proyecto"}</p>
        <h1 className="text-h1 font-bold tracking-[-0.02em] md:text-display">
          {isClient ? "¿Qué necesitás diseñar?" : "Cargar un proyecto"}
        </h1>
        <p className="max-w-2xl text-lead text-ink-2">
          {isClient
            ? "Cuanto más claro el pedido, más rápido lo asignamos. El PM lo revisa y lo pone en manos del equipo."
            : "Podés asignarlo ahora o dejarlo en la bandeja de pendientes."}
        </p>
      </header>
      <ProjectForm mode="create" role={user.role} designers={designers} />
    </div>
  )
}
