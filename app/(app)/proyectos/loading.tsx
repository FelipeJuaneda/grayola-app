import { Skeleton } from "@/components/ui/misc"

// Esqueleto con la forma real: banda de encabezado, contadores y filas.
export default function Loading() {
  return (
    <div role="status" aria-label="Cargando proyectos">
      <div className="border-b border-rule">
        <div className="container-swiss grid gap-3 py-10 md:py-14">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-11 w-72 max-w-full" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
      </div>
      <div className="container-swiss grid gap-12 pt-10">
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="grid gap-3">
              <Skeleton className="h-14 w-20" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
        <div className="grid border-t-2 border-rule-strong">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4 border-b border-rule py-5 md:grid-cols-[3rem_2.4fr_1.1fr_1fr_0.9fr_0.9fr]">
              <Skeleton className="h-5 w-7" />
              <div className="grid gap-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3.5 w-1/2" />
              </div>
              <Skeleton className="hidden h-4 w-24 md:block" />
              <Skeleton className="hidden h-4 w-20 md:block" />
              <Skeleton className="hidden h-6 w-16 md:block" />
              <Skeleton className="hidden h-4 w-16 md:block" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Cargando…</span>
    </div>
  )
}
