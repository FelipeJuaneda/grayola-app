"use client"

import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/dialog"
import { deleteProject } from "@/features/projects/actions"

export function DeleteProjectButton({ projectId, title, fileCount }: { projectId: string; title: string; fileCount: number }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const confirm = () =>
    startTransition(async () => {
      const result = await deleteProject(projectId)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      setOpen(false)
      toast.success("Proyecto eliminado.", { description: title })
      router.push("/proyectos")
      router.refresh()
    })

  return (
    <AlertDialog open={open} onOpenChange={(next) => !pending && setOpen(next)}>
      <AlertDialogTrigger asChild>
        <Button variant="secondary" className="border-danger text-danger hover:bg-danger-subtle">
          <Trash2 aria-hidden="true" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>¿Eliminar “{title}”?</AlertDialogTitle>
        <AlertDialogDescription>
          Se borran el proyecto, su historial
          {fileCount > 0 ? ` y ${fileCount} ${fileCount === 1 ? "archivo" : "archivos"}` : ""}. Esta acción no se puede
          deshacer.
        </AlertDialogDescription>
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel className={buttonVariants({ variant: "ghost" })} disabled={pending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "danger" })}
            disabled={pending}
            onClick={(event) => {
              event.preventDefault()
              confirm()
            }}
          >
            {pending ? "Eliminando…" : "Eliminar proyecto"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
