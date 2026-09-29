import type { ComponentProps } from "react"

import { initials } from "@/lib/format"
import { cn } from "@/lib/utils"

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn("rounded-sm bg-subtle motion-safe:animate-pulse", className)}
      {...props}
    />
  )
}

// Iniciales en un cuadrado: sin fotos de perfil ni emojis.
export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string | null | undefined
  size?: "sm" | "md"
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      title={name ?? undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-sm border border-rule-strong bg-paper font-bold text-ink",
        size === "sm" ? "size-6 text-[0.625rem]" : "size-8 text-caption",
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}

export function AvatarStack({ names, max = 3 }: { names: string[]; max?: number }) {
  const shown = names.slice(0, max)
  const rest = names.length - shown.length
  return (
    <span className="flex items-center -space-x-1">
      {shown.map((name) => (
        <Avatar key={name} name={name} size="sm" className="ring-2 ring-paper" />
      ))}
      {rest > 0 ? (
        <span className="inline-flex size-6 items-center justify-center rounded-sm bg-subtle text-[0.625rem] font-bold ring-2 ring-paper">
          +{rest}
        </span>
      ) : null}
    </span>
  )
}

export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>
}
