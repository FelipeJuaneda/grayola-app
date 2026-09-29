import { z } from "zod"

import { PROJECT_SORTS, PROJECT_STATUSES, PROJECT_VIEWS } from "./constants"

// Compartidos entre el formulario (cliente) y las Server Actions (servidor):
// el servidor vuelve a validar siempre.

export const projectStatusSchema = z.enum(PROJECT_STATUSES)

export const projectIdSchema = z.uuid("Proyecto inválido.")

export const projectFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Poné un título para el proyecto.")
    .max(120, "El título puede tener hasta 120 caracteres."),
  description: z.string().trim().max(2000, "La descripción puede tener hasta 2000 caracteres."),
  dueDate: z.union([z.literal(""), z.iso.date("Elegí una fecha válida.")]),
  assignedTo: z.array(z.uuid()).max(10, "Podés asignar hasta 10 diseñadores."),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>

export const projectFiltersSchema = z.object({
  q: z.string().trim().max(100).optional().catch(undefined),
  status: projectStatusSchema.optional().catch(undefined),
  designer: z.uuid().optional().catch(undefined),
  view: z.enum(PROJECT_VIEWS).catch("list"),
  sort: z.enum(PROJECT_SORTS).catch("recent"),
})

export type ProjectFilters = z.infer<typeof projectFiltersSchema>
