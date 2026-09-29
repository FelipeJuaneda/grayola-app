import type { Metadata } from "next"

import { SignUpForm } from "@/components/auth/auth-forms"

export const metadata: Metadata = { title: "Crear cuenta" }

export default function RegisterPage() {
  return (
    <div className="grid gap-10">
      <header className="grid gap-2">
        <h2 className="text-h1 font-bold tracking-[-0.01em]">Creá tu cuenta</h2>
        <p className="text-body text-ink-2">Pedí proyectos de diseño y seguí cada etapa hasta la entrega.</p>
      </header>
      <SignUpForm />
    </div>
  )
}
