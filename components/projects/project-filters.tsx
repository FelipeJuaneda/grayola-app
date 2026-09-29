"use client"

import { LayoutList, Search, SlidersHorizontal, SquareKanban, X } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/field"
import { PROJECT_STATUSES, STATUS_META } from "@/features/projects/constants"
import type { Person } from "@/features/projects/queries"
import { cn } from "@/lib/utils"

const selectClass =
  "h-11 rounded-sm border border-input bg-surface px-3 text-small text-ink hover:border-ink-2 focus-visible:border-focus"

// Los filtros viven en la URL: se pueden compartir y sobreviven a recargas.
export function ProjectFilters({
  designers,
  showDesigner,
  showView,
  defaultSort = "recent",
}: {
  designers: Person[]
  showDesigner: boolean
  showView: boolean
  defaultSort?: "recent" | "due"
}) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(params.get("q") ?? "")
  const [showMore, setShowMore] = useState(false)
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined)

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString())
    for (const [key, value] of Object.entries(patch)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    startTransition(() => router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }))
  }

  useEffect(() => () => clearTimeout(debounce.current), [])

  const onSearch = (value: string) => {
    setQuery(value)
    clearTimeout(debounce.current)
    debounce.current = setTimeout(() => update({ q: value.trim() || null }), 250)
  }

  const view = params.get("view") === "board" ? "board" : "list"
  const hasFilters = ["q", "status", "designer", "sort"].some((key) => params.has(key))
  const activeCount = ["status", "designer", "sort"].filter((key) => params.has(key)).length

  return (
    <div
      role="search"
      aria-label="Filtrar proyectos"
      className={cn("grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end", isPending && "opacity-80")}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
        <label className="relative grid gap-1.5 lg:w-72">
          <span className="kicker">Buscar</span>
          <Search aria-hidden="true" className="pointer-events-none absolute bottom-3.5 left-3 size-4 text-ink-2" />
          <Input
            type="search"
            value={query}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Título o descripción"
            className="pl-9"
          />
        </label>

        <Button
          variant="secondary"
          className="sm:hidden"
          aria-expanded={showMore}
          aria-controls="filtros-extra"
          onClick={() => setShowMore((v) => !v)}
        >
          <SlidersHorizontal aria-hidden="true" />
          {showMore ? "Ocultar filtros" : `Filtros${activeCount ? ` (${activeCount})` : ""}`}
        </Button>

        <div id="filtros-extra" className={cn(showMore ? "grid" : "hidden", "gap-3 sm:contents")}>
          <label className="grid gap-1.5">
            <span className="kicker">Estado</span>
            <select
              className={selectClass}
              value={params.get("status") ?? ""}
              onChange={(event) => update({ status: event.target.value || null })}
            >
              <option value="">Todos</option>
              {PROJECT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {STATUS_META[status].label}
                </option>
              ))}
            </select>
          </label>

          {showDesigner ? (
            <label className="grid gap-1.5">
              <span className="kicker">Diseño</span>
              <select
                className={selectClass}
                value={params.get("designer") ?? ""}
                onChange={(event) => update({ designer: event.target.value || null })}
              >
                <option value="">Todo el equipo</option>
                {designers.map((designer) => (
                  <option key={designer.id} value={designer.id}>
                    {designer.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="grid gap-1.5">
            <span className="kicker">Orden</span>
            <select
              className={selectClass}
              value={params.get("sort") ?? defaultSort}
              onChange={(event) => update({ sort: event.target.value === defaultSort ? null : event.target.value })}
            >
              <option value="recent">Más recientes</option>
              <option value="due">Próximos a vencer</option>
            </select>
          </label>

          {hasFilters ? (
            <Button
              variant="ghost"
              onClick={() => {
                setQuery("")
                update({ q: null, status: null, designer: null, sort: null })
              }}
            >
              <X aria-hidden="true" />
              Limpiar filtros
            </Button>
          ) : null}
        </div>
      </div>

      {showView ? (
        <div role="group" aria-label="Vista" className="inline-flex border border-rule-strong">
          {(
            [
              { value: "list", label: "Lista", Icon: LayoutList },
              { value: "board", label: "Tablero", Icon: SquareKanban },
            ] as const
          ).map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={view === value}
              onClick={() => update({ view: value === "list" ? null : value })}
              className={cn(
                "inline-flex h-11 items-center gap-2 px-4 text-small font-semibold",
                view === value ? "bg-ink text-on-ink" : "text-ink hover:bg-subtle",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
