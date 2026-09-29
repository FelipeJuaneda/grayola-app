"use client"

import { FileArchive, FileText, ImageIcon, Upload, X } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  ACCEPT_ATTRIBUTE,
  ACCEPTED_FILE_TYPES,
  MAX_FILES_PER_BATCH,
  validateFile,
} from "@/features/files/constants"
import { formatFileSize } from "@/lib/format"
import { cn } from "@/lib/utils"

export type QueuedFile = {
  id: string
  file: File
  progress: number
  status: "queued" | "uploading" | "done" | "error"
  error?: string
}

export function fileIcon(type: string) {
  if (type.startsWith("image/")) return ImageIcon
  if (type.includes("zip")) return FileArchive
  return FileText
}

function Thumbnail({ file }: { file: File }) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.type)) return
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const Icon = fileIcon(file.type)
  return url ? (
    // eslint-disable-next-line @next/next/no-img-element -- blob local, no optimizable
    <img src={url} alt="" className="size-12 shrink-0 border border-rule object-cover" />
  ) : (
    <span className="flex size-12 shrink-0 items-center justify-center border border-rule bg-subtle">
      <Icon aria-hidden="true" className="size-5 text-ink-2" />
    </span>
  )
}

// Zona de carga con arrastrar y soltar o selector; valida tipo/tamaño antes
// de subir y muestra el progreso de cada archivo.
export function FileDropzone({
  files,
  onChange,
  disabled,
  compact,
}: {
  files: QueuedFile[]
  onChange: (next: QueuedFile[]) => void
  disabled?: boolean
  compact?: boolean
}) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [rejections, setRejections] = useState<string[]>([])

  const add = (list: FileList | File[]) => {
    const incoming = Array.from(list)
    const errors: string[] = []
    const accepted: QueuedFile[] = []
    for (const file of incoming) {
      const error = validateFile(file)
      if (error) errors.push(error)
      else accepted.push({ id: crypto.randomUUID(), file, progress: 0, status: "queued" })
    }
    const room = MAX_FILES_PER_BATCH - files.length
    if (accepted.length > room) errors.push(`Podés adjuntar hasta ${MAX_FILES_PER_BATCH} archivos por vez.`)
    setRejections(errors)
    if (accepted.length > 0) onChange([...files, ...accepted.slice(0, Math.max(room, 0))])
  }

  const formats = [...new Set(Object.values(ACCEPTED_FILE_TYPES))].join(", ")

  return (
    <div className="grid gap-3">
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          if (!disabled) add(event.dataTransfer.files)
        }}
        className={cn(
          "grid cursor-pointer place-items-center gap-2 border-2 border-dashed border-ink-3 bg-surface px-4 text-center",
          "transition-colors duration-[var(--duration-fast)] hover:border-ink-2",
          "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus",
          compact ? "py-6" : "py-10",
          dragging && "border-solid border-signal-progress bg-subtle",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <Upload aria-hidden="true" className="size-5" />
        <span className="text-body font-semibold">
          {dragging ? "Soltá los archivos acá" : "Arrastrá archivos o elegilos desde tu equipo"}
        </span>
        <span className="text-small text-ink-2">
          {formats} · hasta 20 MB cada uno · máximo {MAX_FILES_PER_BATCH} por vez
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          multiple
          accept={ACCEPT_ATTRIBUTE}
          disabled={disabled}
          className="sr-only"
          onChange={(event) => {
            if (event.target.files) add(event.target.files)
            event.target.value = ""
          }}
        />
      </label>

      {rejections.length > 0 ? (
        <ul role="alert" className="grid gap-1 border-t-2 border-danger bg-danger-subtle px-3 py-2 text-small">
          {rejections.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      ) : null}

      {files.length > 0 ? (
        <ul className="grid border-t border-rule" aria-label="Archivos para subir">
          {files.map((item) => (
            <li key={item.id} className="flex items-center gap-3 border-b border-rule py-2.5">
              <Thumbnail file={item.file} />
              <div className="grid min-w-0 flex-1 gap-1">
                <span className="truncate text-small font-semibold">{item.file.name}</span>
                <span className="text-caption text-ink-2">
                  {formatFileSize(item.file.size)}
                  {item.status === "uploading" ? ` · subiendo ${Math.round(item.progress * 100)}%` : null}
                  {item.status === "done" ? " · subido" : null}
                </span>
                {item.status === "uploading" || item.status === "done" ? (
                  <span
                    role="progressbar"
                    aria-label={`Progreso de ${item.file.name}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(item.progress * 100)}
                    className="h-1 bg-subtle"
                  >
                    <span
                      className={cn(
                        "block h-full transition-[width] duration-[var(--duration-base)]",
                        item.status === "done" ? "bg-signal-done" : "bg-signal-progress",
                      )}
                      style={{ width: `${Math.round(item.progress * 100)}%` }}
                    />
                  </span>
                ) : null}
                {item.error ? <span className="text-caption font-medium text-danger">{item.error}</span> : null}
              </div>
              {item.status === "queued" || item.status === "error" ? (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onChange(files.filter((f) => f.id !== item.id))}
                  aria-label={`Quitar ${item.file.name}`}
                >
                  <X aria-hidden="true" />
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
