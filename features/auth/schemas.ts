import { z } from "zod"

export const signInSchema = z.object({
  email: z.email("Ingresá un correo válido, por ejemplo nombre@estudio.com."),
  password: z.string().min(6, "La contraseña tiene al menos 6 caracteres."),
})

export const signUpSchema = signInSchema.extend({
  fullName: z
    .string()
    .trim()
    .min(2, "Contanos tu nombre (al menos 2 letras).")
    .max(120, "El nombre puede tener hasta 120 caracteres."),
})

export type SignInValues = z.infer<typeof signInSchema>
export type SignUpValues = z.infer<typeof signUpSchema>

export const DEMO_ROLES = ["pm", "client", "designer"] as const
export type DemoRole = (typeof DEMO_ROLES)[number]
