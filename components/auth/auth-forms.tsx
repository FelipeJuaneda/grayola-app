"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, Input } from "@/components/ui/field"
import { demoSignIn, signIn, signUp } from "@/features/auth/actions"
import {
  type DemoRole,
  type SignInValues,
  type SignUpValues,
  signInSchema,
  signUpSchema,
} from "@/features/auth/schemas"

function PasswordInput(props: React.ComponentProps<typeof Input>) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className="pr-12" />
      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute top-1 right-1"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={visible}
      >
        {visible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
      </Button>
    </div>
  )
}

function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="border-t-2 border-danger bg-danger-subtle px-3 py-2 text-small font-medium">
      {message}
    </p>
  )
}

export function SignInForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  })
  const { register, handleSubmit, formState } = form

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    // En éxito la acción redirige; solo volvemos acá si hubo error.
    const result = await signIn(values)
    if (result && !result.ok) setServerError(result.error)
  })

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <FormError message={serverError} />
      <Field id="email" label="Correo" error={formState.errors.email?.message}>
        {(aria) => (
          <Input {...aria} type="email" autoComplete="email" placeholder="nombre@estudio.com" {...register("email")} />
        )}
      </Field>
      <Field id="password" label="Contraseña" error={formState.errors.password?.message}>
        {(aria) => <PasswordInput {...aria} autoComplete="current-password" {...register("password")} />}
      </Field>
      <Button type="submit" disabled={formState.isSubmitting} className="w-full">
        {formState.isSubmitting ? "Ingresando…" : "Ingresar"}
      </Button>
      <p className="text-small text-ink-2">
        ¿No tenés cuenta?{" "}
        <Link href="/register" className="font-semibold text-ink underline underline-offset-4">
          Creá una
        </Link>
      </p>
    </form>
  )
}

export function SignUpForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  })
  const { register, handleSubmit, formState, getValues } = form

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    const result = await signUp(values)
    if (!result) return
    if (!result.ok) setServerError(result.error)
    else if (result.data.needsConfirmation) setConfirmationSent(true)
  })

  if (confirmationSent) {
    return (
      <div role="status" className="grid gap-3 border-t-2 border-signal-done bg-surface px-4 py-4">
        <p className="font-semibold">Revisá tu correo</p>
        <p className="text-small text-ink-2">
          Te enviamos un enlace a <strong className="text-ink">{getValues("email")}</strong> para confirmar la cuenta.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <FormError message={serverError} />
      <Field id="fullName" label="Nombre y apellido" error={formState.errors.fullName?.message}>
        {(aria) => <Input {...aria} autoComplete="name" placeholder="Lucía Fernández" {...register("fullName")} />}
      </Field>
      <Field id="email" label="Correo" error={formState.errors.email?.message}>
        {(aria) => (
          <Input {...aria} type="email" autoComplete="email" placeholder="nombre@estudio.com" {...register("email")} />
        )}
      </Field>
      <Field id="password" label="Contraseña" hint="Al menos 6 caracteres." error={formState.errors.password?.message}>
        {(aria) => <PasswordInput {...aria} autoComplete="new-password" {...register("password")} />}
      </Field>
      <Button type="submit" disabled={formState.isSubmitting} className="w-full">
        {formState.isSubmitting ? "Creando cuenta…" : "Crear cuenta"}
      </Button>
      <p className="text-small text-ink-2">
        Las cuentas nuevas entran como <strong className="text-ink">cliente</strong>. ¿Ya tenés una?{" "}
        <Link href="/login" className="font-semibold text-ink underline underline-offset-4">
          Ingresá
        </Link>
      </p>
    </form>
  )
}

const DEMO_OPTIONS: { role: DemoRole; label: string; description: string }[] = [
  { role: "pm", label: "Project Manager", description: "Ve todo, asigna y organiza" },
  { role: "client", label: "Cliente", description: "Pide proyectos y sigue su avance" },
  { role: "designer", label: "Diseño", description: "Trabaja lo que tiene asignado" },
]

// Para quienes evalúan el portfolio: entrar a cada rol en un clic.
export function DemoAccess() {
  const [pendingRole, setPendingRole] = useState<DemoRole | null>(null)
  const [, startTransition] = useTransition()

  const enter = (role: DemoRole) => {
    setPendingRole(role)
    startTransition(async () => {
      const result = await demoSignIn(role)
      if (result && !result.ok) {
        toast.error(result.error)
        setPendingRole(null)
      }
    })
  }

  return (
    <section aria-labelledby="demo-title" className="grid gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="demo-title" className="kicker">
          Entrar como demo
        </h2>
        <span className="text-caption text-ink-2">Datos ficticios</span>
      </div>
      <ul className="grid border-t border-rule">
        {DEMO_OPTIONS.map((option) => (
          <li key={option.role}>
            <button
              type="button"
              onClick={() => enter(option.role)}
              disabled={pendingRole !== null}
              className="group flex min-h-14 w-full items-center justify-between gap-4 border-b border-rule text-left hover:bg-subtle disabled:opacity-60"
            >
              <span className="grid px-1">
                <span className="text-small font-bold">{option.label}</span>
                <span className="text-caption text-ink-2">{option.description}</span>
              </span>
              <span
                aria-hidden="true"
                className="px-2 text-ink-2 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
              >
                {pendingRole === option.role ? "…" : "→"}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
