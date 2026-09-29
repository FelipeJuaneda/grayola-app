"use client"

import { Download, Trash2 } from "lucide-react"
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
import { deleteProjectFile, getFileDownloadUrl } from "@/features/files/actions"
import { uploadProjectFile } from "@/features/files/upload"
import type { ProjectFile } from "@/features/projects/queries"
import { formatFileSize, formatRelative } from "@/lib/format"

import { FileDropzone, fileIcon, type QueuedFile } from "./file-dropzone"

function FileRow({ file, canDelete }: { file: ProjectFile; canDelete: boolean }) {
  const router = useRouter()
  const [downloading, startDownload] = useTransition()
  const [deleting, startDelete] = useTransition()
  const Icon = fileIcon(file.mimeType)

  const download = () =>
    startDownload(async () => {
      const result = await getFileDownloadUrl(file.id)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      window.location.assign(result.data.url)
    })

  const remove = () =>
    startDelete(async () => {
      const result = await deleteProjectFile(file.id)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success("Archivo eliminado.", { description: file.name })
      router.refresh()
    })

  return (
    <li className="flex items-center gap-3 border-b border-rule py-3">
      {file.previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- URL firmada temporal de Storage
        <img src={file.previewUrl} alt="" loading="lazy" className="size-14 shrink-0 border border-rule object-cover" />
      ) : (
        <span className="flex size-14 shrink-0 items-center justify-center border border-rule bg-subtle">
          <Icon aria-hidden="true" className="size-5 text-ink-2" />
        </span>
      )}
      <div className="grid min-w-0 flex-1">
        <span className="truncate text-small font-semibold">{file.name}</span>
        <span className="text-caption text-ink-2">
          {formatFileSize(file.size)} · {file.uploadedBy?.name ?? "Alguien"} · {formatRelative(file.createdAt)}
        </span>
      </div>
      <Button variant="secondary" size="sm" onClick={download} disabled={downloading} aria-label={`Descargar ${file.name}`}>
        <Download aria-hidden="true" />
        <span className="hidden sm:inline">{downloading ? "Preparando…" : "Descargar"}</span>
      </Button>
      {canDelete ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label={`Eliminar ${file.name}`} disabled={deleting}>
              <Trash2 aria-hidden="true" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>¿Eliminar “{file.name}”?</AlertDialogTitle>
            <AlertDialogDescription>El archivo se borra del almacenamiento y no se puede recuperar.</AlertDialogDescription>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <AlertDialogCancel className={buttonVariants({ variant: "ghost" })}>Cancelar</AlertDialogCancel>
              <AlertDialogAction className={buttonVariants({ variant: "danger" })} onClick={remove}>
                Eliminar archivo
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </li>
  )
}

export function FileManager({
  projectId,
  files,
  canUpload,
  canDelete,
}: {
  projectId: string
  files: ProjectFile[]
  canUpload: boolean
  canDelete: boolean
}) {
  const router = useRouter()
  const [queue, setQueue] = useState<QueuedFile[]>([])
  const [uploading, setUploading] = useState(false)

  const upload = async () => {
    setUploading(true)
    let ok = 0
    for (const item of queue.filter((q) => q.status === "queued" || q.status === "error")) {
      setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, status: "uploading", error: undefined } : q)))
      const result = await uploadProjectFile(projectId, item.file, (progress) =>
        setQueue((prev) => prev.map((q) => (q.id === item.id ? { ...q, progress } : q))),
      )
      if (result.ok) ok += 1
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
    setUploading(false)
    if (ok > 0) {
      toast.success(ok === 1 ? "Archivo subido." : `${ok} archivos subidos.`)
      setQueue((prev) => prev.filter((q) => q.status !== "done"))
      router.refresh()
    }
  }

  const pendingCount = queue.filter((q) => q.status === "queued" || q.status === "error").length

  return (
    <div className="grid gap-5">
      {files.length === 0 ? (
        <p className="border-y border-dashed border-rule py-6 text-small text-ink-2">
          {canUpload ? "Todavía no hay archivos. Sumá referencias o piezas abajo." : "Todavía no hay archivos en este proyecto."}
        </p>
      ) : (
        <ul className="border-t border-rule" aria-label="Archivos del proyecto">
          {files.map((file) => (
            <FileRow key={file.id} file={file} canDelete={canDelete} />
          ))}
        </ul>
      )}

      {canUpload ? (
        <div className="grid gap-3">
          <FileDropzone files={queue} onChange={setQueue} disabled={uploading} compact />
          {pendingCount > 0 ? (
            <div className="flex justify-end">
              <Button onClick={upload} disabled={uploading}>
                {uploading ? "Subiendo…" : `Subir ${pendingCount} ${pendingCount === 1 ? "archivo" : "archivos"}`}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
