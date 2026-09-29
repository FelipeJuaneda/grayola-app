import { Skeleton } from "@/components/ui/misc"

export default function Loading() {
  return (
    <div role="status" aria-label="Cargando proyecto" className="container-swiss grid gap-10 pt-8">
      <Skeleton className="h-4 w-24" />
      <div className="grid gap-3">
        <Skeleton className="h-3 w-56" />
        <Skeleton className="h-12 w-[32rem] max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="grid gap-2 border-t-4 border-rule pt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="grid gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
        <div className="grid content-start gap-4 border-t-2 border-rule-strong pt-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="grid content-start gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="grid gap-2 border-t border-rule pt-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Cargando…</span>
    </div>
  )
}
