import Link from "next/link"

import { cn } from "@/lib/utils"

// Marca propia del caso (no es el logo de Grayola): un nodo de la ruta en
// cobalto + el nombre en grotesca expandida.
export function Wordmark({ href = "/proyectos", className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5 font-bold tracking-[-0.02em]", className)}
      aria-label="Grayola, inicio"
    >
      <span aria-hidden="true" className="grid size-5 grid-cols-2 grid-rows-2 gap-[2px]">
        <span className="bg-ink" />
        <span className="bg-transparent" />
        <span className="bg-signal-progress" />
        <span className="bg-ink" />
      </span>
      <span className="text-lead [font-stretch:115%]">Grayola</span>
    </Link>
  )
}
