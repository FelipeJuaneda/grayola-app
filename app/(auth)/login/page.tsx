import type { Metadata } from "next"

import { DemoAccess, SignInForm } from "@/components/auth/auth-forms"

export const metadata: Metadata = { title: "Ingresar" }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // El proxy redirige con ?aviso=servicio cuando Supabase no responde.
  const { aviso } = await searchParams

  return (
    <div className="grid gap-10">
      <header className="grid gap-2">
        <h2 className="text-h1 font-bold tracking-[-0.01em]">Ingresá a tu espacio</h2>
        <p className="text-body text-ink-2">Con tu correo y contraseña, o probá un rol de demo.</p>
      </header>
      {aviso === "servicio" ? (
        <p role="status" className="border-t-2 border-signal-review bg-surface px-4 py-3 text-small">
          <strong className="font-semibold">El servicio no está disponible en este momento.</strong> La base de datos de
          la demo puede estar reiniciándose; probá de nuevo en unos minutos.
        </p>
      ) : null}
      <SignInForm />
      <DemoAccess />
    </div>
  )
}
