"use client"

import { Check, ChevronDown, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/misc"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import type { Person } from "@/features/projects/queries"
import { cn } from "@/lib/utils"

// Selector múltiple accesible: una lista de casillas en un popover, con los
// elegidos visibles como fichas que se pueden quitar desde el teclado.
export function AssigneePicker({
  id,
  designers,
  value,
  onChange,
  invalid,
  describedBy,
}: {
  id: string
  designers: Person[]
  value: string[]
  onChange: (next: string[]) => void
  invalid?: boolean
  describedBy?: string
}) {
  const selected = designers.filter((d) => value.includes(d.id))
  const toggle = (designerId: string) =>
    onChange(value.includes(designerId) ? value.filter((v) => v !== designerId) : [...value, designerId])

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            className={cn(
              "flex h-11 w-full items-center justify-between rounded-sm border border-input bg-surface px-3 text-left text-body",
              "hover:border-ink-2 aria-invalid:border-danger data-[state=open]:border-focus",
            )}
          >
            <span className={cn(selected.length === 0 && "text-ink-2")}>
              {selected.length === 0
                ? "Elegí quién lo trabaja"
                : `${selected.length} ${selected.length === 1 ? "diseñador" : "diseñadores"}`}
            </span>
            <ChevronDown aria-hidden="true" className="size-4 text-ink-2" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-64 p-1">
          <fieldset>
            <legend className="kicker px-2.5 pt-2 pb-1">Equipo de diseño</legend>
            {designers.length === 0 ? (
              <p className="px-2.5 py-3 text-small text-ink-2">No hay diseñadores cargados.</p>
            ) : (
              designers.map((designer) => {
                const checked = value.includes(designer.id)
                return (
                  <label
                    key={designer.id}
                    className="flex min-h-11 cursor-pointer items-center gap-3 rounded-sm px-2.5 hover:bg-subtle has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-focus"
                  >
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={checked}
                      onChange={() => toggle(designer.id)}
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-4 items-center justify-center border-2",
                        checked ? "border-ink bg-ink text-on-ink" : "border-ink-3",
                      )}
                    >
                      {checked ? <Check className="size-3" strokeWidth={3} /> : null}
                    </span>
                    <Avatar name={designer.name} size="sm" />
                    <span className="grid leading-tight">
                      <span className="text-small font-semibold">{designer.name}</span>
                      {designer.email ? <span className="text-caption text-ink-2">{designer.email}</span> : null}
                    </span>
                  </label>
                )
              })
            )}
          </fieldset>
        </PopoverContent>
      </Popover>

      {selected.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Diseñadores elegidos">
          {selected.map((designer) => (
            <li key={designer.id}>
              <span className="inline-flex items-center gap-2 border border-rule-strong py-1 pr-1 pl-2 text-small">
                <Avatar name={designer.name} size="sm" className="border-0" />
                {designer.name}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="size-7"
                  onClick={() => toggle(designer.id)}
                  aria-label={`Quitar a ${designer.name}`}
                >
                  <X aria-hidden="true" />
                </Button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
