"use client"

import { supabaseEnv } from "@/lib/supabase/env"

import { createUploadTarget, registerUploadedFile } from "./actions"

export type UploadProgress = (fraction: number) => void

// PUT a la URL firmada con XMLHttpRequest (fetch no expone progreso de subida).
// Replica el formato de storage-js uploadToSignedUrl.
function putWithProgress(signedUrl: string, file: File, onProgress: UploadProgress, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", signedUrl)
    xhr.setRequestHeader("apikey", supabaseEnv.publishableKey)
    xhr.setRequestHeader("x-upsert", "false")

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total)
    }
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`HTTP ${xhr.status}`)))
    xhr.onerror = () => reject(new Error("network"))
    xhr.onabort = () => reject(new DOMException("Aborted", "AbortError"))
    signal?.addEventListener("abort", () => xhr.abort(), { once: true })

    const body = new FormData()
    body.append("cacheControl", "3600")
    body.append("", file)
    xhr.send(body)
  })
}

export async function uploadProjectFile(
  projectId: string,
  file: File,
  onProgress: UploadProgress,
  signal?: AbortSignal,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const meta = { projectId, name: file.name, size: file.size, type: file.type }
  const target = await createUploadTarget(meta)
  if (!target.ok) return { ok: false, error: target.error }

  try {
    await putWithProgress(target.data.signedUrl, file, onProgress, signal)
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, error: `Se canceló la subida de "${file.name}".` }
    }
    return { ok: false, error: `No pudimos subir "${file.name}". Revisá tu conexión y probá de nuevo.` }
  }

  const registered = await registerUploadedFile({ ...meta, path: target.data.path })
  if (!registered.ok) return { ok: false, error: registered.error }
  onProgress(1)
  return { ok: true }
}
