import type { ReactNode } from "react"

// Vacío dibujado sobre la grilla: un "00" apagado y una invitación concreta.
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <div className="grid-rules grid gap-6 border-t-2 border-rule-strong py-12 md:grid-cols-[auto_minmax(0,1fr)] md:items-end md:gap-10 md:py-16">
      <span aria-hidden="true" className="numeral text-numeral text-ink-3 md:text-[7rem] md:leading-[0.85]">
        00
      </span>
      <div className="grid max-w-md gap-3">
        <h2 className="text-h2 font-bold">{title}</h2>
        <p className="text-body text-ink-2">{description}</p>
        {action ? <div className="mt-2">{action}</div> : null}
      </div>
    </div>
  )
}
