import type { Metadata } from "next"

import { ProfileForm } from "@/components/profile/profile-form"
import { requireUser, type Role } from "@/lib/auth/session"
import { ROLE_LABEL } from "@/lib/roles"

export const metadata: Metadata = { title: "Tu perfil" }

const PERMISSIONS: Record<Role, string[]> = {
  client: [
    "Crear pedidos y adjuntar archivos",
    "Ver solo tus proyectos y quién los trabaja",
    "Seguir el estado y el historial de cada uno",
  ],
  designer: [
    "Ver los proyectos que tenés asignados",
    "Cambiar el estado de tus proyectos",
    "Descargar los archivos del cliente",
  ],
  pm: [
    "Ver todos los proyectos del estudio",
    "Crear, editar, asignar y eliminar",
    "Gestionar archivos y estados",
  ],
}

export default async function ProfilePage() {
  const user = await requireUser()

  return (
    <div className="container-swiss grid max-w-5xl gap-10 pt-10">
      <header className="grid gap-2">
        <p className="kicker">Tu perfil</p>
        <h1 className="text-h1 font-bold tracking-[-0.02em] md:text-display">{user.fullName ?? user.email}</h1>
      </header>

      <section className="grid gap-6 border-t-2 border-rule-strong pt-6 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
        <h2 className="text-lead font-bold">Datos</h2>
        <ProfileForm defaultName={user.fullName ?? ""} />
      </section>

      <section className="grid gap-6 border-t-2 border-rule-strong pt-6 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
        <div>
          <h2 className="text-lead font-bold">Cuenta</h2>
          <p className="mt-1 text-small text-ink-2">El rol lo asigna el estudio; no se cambia desde la app.</p>
        </div>
        <dl className="grid max-w-md">
          <div className="grid gap-1 border-t border-rule py-3">
            <dt className="kicker">Correo</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="grid gap-1 border-t border-rule py-3">
            <dt className="kicker">Rol</dt>
            <dd className="font-semibold">{ROLE_LABEL[user.role]}</dd>
          </div>
          <div className="grid gap-2 border-y border-rule py-3">
            <dt className="kicker">Qué podés hacer</dt>
            <dd>
              <ul className="grid gap-1.5">
                {PERMISSIONS[user.role].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-ink" />
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}
