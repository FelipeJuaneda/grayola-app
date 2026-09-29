import { Label as LabelPrimitive } from "radix-ui"
import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/lib/utils"

const controlBase = [
  "w-full rounded-sm border border-input bg-surface px-3 text-body text-ink",
  "placeholder:text-ink-2",
  "transition-[border-color,box-shadow] duration-[var(--duration-fast)]",
  "hover:border-ink-2 focus-visible:border-focus focus-visible:outline-offset-0",
  "aria-invalid:border-danger aria-invalid:focus-visible:outline-danger",
  "disabled:cursor-not-allowed disabled:opacity-50",
]

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input data-slot="input" className={cn(controlBase, "h-11", className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(controlBase, "min-h-32 resize-y py-2.5 leading-relaxed", className)}
      {...props}
    />
  )
}

export function Label({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root data-slot="label" className={cn("text-small font-semibold text-ink", className)} {...props} />
  )
}

type FieldProps = {
  id: string
  label: ReactNode
  hint?: ReactNode
  error?: string
  required?: boolean
  className?: string
  children: (aria: {
    id: string
    "aria-invalid": boolean | undefined
    "aria-describedby": string | undefined
    "aria-required": boolean | undefined
  }) => ReactNode
}

// Etiqueta + control + ayuda + error enlazados por ids (lectores de pantalla
// anuncian el error junto al campo).
export function Field({ id, label, hint, error, required, className, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined

  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? (
          <span className="ml-1 font-normal text-ink-2" aria-hidden="true">
            (obligatorio)
          </span>
        ) : null}
      </Label>
      {children({
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
      })}
      {hint && !error ? (
        <p id={hintId} className="text-small text-ink-2">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-small font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  )
}
