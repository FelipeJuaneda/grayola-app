"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Field, Input } from "@/components/ui/field"
import { updateProfileName } from "@/features/users/actions"

export function ProfileForm({ defaultName }: { defaultName: string }) {
  const [name, setName] = useState(defaultName)
  const [error, setError] = useState<string | undefined>()
  const [pending, startTransition] = useTransition()

  return (
    <form
      noValidate
      className="grid max-w-md gap-5"
      onSubmit={(event) => {
        event.preventDefault()
        setError(undefined)
        startTransition(async () => {
          const result = await updateProfileName({ fullName: name })
          if (result.ok) toast.success("Nombre actualizado.")
          else {
            setError(result.fieldErrors?.fullName?.[0] ?? result.error)
            toast.error(result.error)
          }
        })
      }}
    >
      <Field id="fullName" label="Nombre y apellido" hint="Así te ven el PM y tu equipo." error={error}>
        {(aria) => <Input {...aria} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />}
      </Field>
      <div>
        <Button type="submit" disabled={pending || name.trim() === defaultName}>
          {pending ? "Guardando…" : "Guardar nombre"}
        </Button>
      </div>
    </form>
  )
}
