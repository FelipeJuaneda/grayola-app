import type { Metadata } from "next"

import { DemoAccess, SignInForm } from "@/components/auth/auth-forms"

export const metadata: Metadata = { title: "Ingresar" }

export default function LoginPage() {
  return (
    <div className="grid gap-10">
      <header className="grid gap-2">
        <h2 className="text-h1 font-bold tracking-[-0.01em]">Ingresá a tu espacio</h2>
        <p className="text-body text-ink-2">Con tu correo y contraseña, o probá un rol de demo.</p>
      </header>
      <SignInForm />
      <DemoAccess />
    </div>
  )
}
