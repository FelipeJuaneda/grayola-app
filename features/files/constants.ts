// Debe coincidir con el bucket `project-files` (migración 0006).
export const MAX_FILE_SIZE = 20 * 1024 * 1024
export const MAX_FILES_PER_BATCH = 10

export const ACCEPTED_FILE_TYPES: Record<string, string> = {
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/webp": "WEBP",
  "image/gif": "GIF",
  "image/svg+xml": "SVG",
  "application/pdf": "PDF",
  "application/zip": "ZIP",
  "application/x-zip-compressed": "ZIP",
}

export const ACCEPT_ATTRIBUTE = Object.keys(ACCEPTED_FILE_TYPES).join(",")

export function validateFile(file: { name: string; size: number; type: string }): string | null {
  if (!ACCEPTED_FILE_TYPES[file.type]) {
    return `"${file.name}" no es un formato admitido (imágenes, PDF o ZIP).`
  }
  if (file.size === 0) return `"${file.name}" está vacío.`
  if (file.size > MAX_FILE_SIZE) return `"${file.name}" pesa más de 20 MB.`
  return null
}

// Nombre seguro para la ruta de Storage (el nombre original se guarda aparte).
export function storageSafeName(name: string) {
  const dot = name.lastIndexOf(".")
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // quita tildes tras normalizar
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
  const ext =
    dot > 0
      ? name
          .slice(dot + 1)
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
      : ""
  return `${base || "archivo"}${ext ? `.${ext}` : ""}`
}
