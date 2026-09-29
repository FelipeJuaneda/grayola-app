"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"

import { FileDropzone, type QueuedFile } from "@/components/files/file-dropzone"
import { Button, buttonVariants } from "@/components/ui/button"
import { Field, Input, Textarea } from "@/components/ui/field"
import { uploadProjectFile } from "@/features/files/upload"
import { createProject, updateProject } from "@/features/projects/actions"
import type { Person } from "@/features/projects/queries"
import { type ProjectFormValues, projectFormSchema } from "@/features/projects/schemas"
import type { Role } from "@/lib/auth/session"

import { AssigneePicker } from "./assignee-picker"

type Props =
  | { mode: "create"; role: Role; designers: Person[]; defaultValues?: undefined; projectId?: undefined }
  | { mode: "edit"; role: Role; designers: Person[]; defaultValues: ProjectFormValues; projectId: string }

const EMPTY: ProjectFormValues = { title: "", description: "", dueDate: "", assignedTo: [] }

export function ProjectForm({ mode, role, designers, defaultValues, projectId }: Props) {
  const router = useRouter()
  const [queue, setQueue] = useState<QueuedFile[]>([])
  const [phase, setPhase] = useState<"idle" | "saving" | "uploading">("idle")
  const isPm = role === "pm"

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: defaultValues ?? EMPTY,
    mode: "onTouched",
  })
  const { register, handleSubmit, control, formState, setError, watch } = form
  const description = watch("description") ?? ""

  const uploadQueue = async (id: string) => {
    let failed = 0
    for (const item of queue) {
      setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "uploading" } : q)))
      const result = await uploadProjectFile(id, item.file, (progress) =>
        setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, progress } : q))),
      )
      if (!result.ok) failed += 1
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id
            ? result.ok
              ? { ...q, status: "done", progress: 1 }
              : { ...q, status: "error", error: result.error }
            : q,
        ),
      )
    }
    return failed
  }

  const onSubmit = handleSubmit(async (values) => {
    setPhase("saving")
    const result = mode === "create" ? await createProject(values) : await updateProject(projectId, values)

    if (!result.ok) {
      setPhase("idle")
      // Los datos del formulario se conservan: solo se marcan los errores.
      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        if (messages[0]) setError(field as keyof ProjectFormValues, { message: messages[0] })
      }
      toast.error(result.error)
      return
    }

    const id = result.data.id
    if (mode === "create" && queue.length > 0) {
      setPhase("uploading")
      const failed = await uploadQueue(id)
      if (failed > 0) {
        toast.warning("El proyecto se creó, pero algunos archivos no se subieron.", {
          description: "Podés reintentarlos desde el detalle del proyecto.",
        })
      } else {
        toast.success("Proyecto creado con sus archivos.")
      }
    } else {
      toast.success(mode === "create" ? "Proyecto creado." : "Cambios guardados.")
    }
    router.push(`/proyectos/${id}`)
    router.refresh()
  })

  const busy = phase !== "idle"
  const submitLabel =
    phase === "saving"
      ? "Guardando…"
      : phase === "uploading"
        ? "Subiendo archivos…"
        : mode === "create"
          ? "Crear proyecto"
          : "Guardar cambios"

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8">
      <section className="grid gap-6 border-t-2 border-rule-strong pt-6 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
        <div>
          <h2 className="text-lead font-bold">El pedido</h2>
          <p className="mt-1 text-small text-ink-2">Qué hay que diseñar y para cuándo.</p>
        </div>
        <div className="grid gap-5">
          <Field id="title" label="Título" required error={formState.errors.title?.message}>
            {(aria) => (
              <Input {...aria} {...register("title")} placeholder="Rebranding para una cafetería" autoComplete="off" />
            )}
          </Field>

          <Field
            id="description"
            label="Descripción"
            hint={`Objetivo, piezas y referencias. ${description.length}/2000`}
            error={formState.errors.description?.message}
          >
            {(aria) => (
              <Textarea
                {...aria}
                {...register("description")}
                placeholder="Necesitamos un logotipo, paleta y aplicaciones para packaging…"
                maxLength={2000}
              />
            )}
          </Field>

          <Field
            id="dueDate"
            label="Fecha de entrega"
            hint="Opcional. Ayuda al equipo a priorizar."
            error={formState.errors.dueDate?.message}
            className="max-w-xs"
          >
            {(aria) => <Input {...aria} type="date" {...register("dueDate")} />}
          </Field>
        </div>
      </section>

      {isPm ? (
        <section className="grid gap-6 border-t-2 border-rule-strong pt-6 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
          <div>
            <h2 className="text-lead font-bold">Equipo</h2>
            <p className="mt-1 text-small text-ink-2">Quién lo va a trabajar. Podés cambiarlo después.</p>
          </div>
          <Field id="assignedTo" label="Diseñadores asignados" error={formState.errors.assignedTo?.message}>
            {(aria) => (
              <Controller
                control={control}
                name="assignedTo"
                render={({ field }) => (
                  <AssigneePicker
                    id={aria.id}
                    designers={designers}
                    value={field.value}
                    onChange={field.onChange}
                    invalid={aria["aria-invalid"]}
                    describedBy={aria["aria-describedby"]}
                  />
                )}
              />
            )}
          </Field>
        </section>
      ) : null}

      {mode === "create" ? (
        <section className="grid gap-6 border-t-2 border-rule-strong pt-6 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
          <div>
            <h2 className="text-lead font-bold">Archivos</h2>
            <p className="mt-1 text-small text-ink-2">Referencias, briefs o piezas actuales. Se guardan en privado.</p>
          </div>
          <FileDropzone files={queue} onChange={setQueue} disabled={busy} />
        </section>
      ) : null}

      <div className="flex flex-col-reverse gap-3 border-t-2 border-rule-strong pt-6 sm:flex-row sm:justify-end">
        <Link
          href={mode === "edit" ? `/proyectos/${projectId}` : "/proyectos"}
          className={buttonVariants({ variant: "ghost" })}
          aria-disabled={busy || undefined}
        >
          Cancelar
        </Link>
        <Button type="submit" disabled={busy} aria-live="polite">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
