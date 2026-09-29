import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

// Botón de cartel: esquinas casi rectas, peso firme, sin sombras.
// md = 44px (objetivo táctil); sm = 36px con área de toque extendida a 44px.
export const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 rounded-sm whitespace-nowrap",
    "font-semibold tracking-[0.01em] select-none",
    "transition-[background-color,color,border-color,translate] duration-[var(--duration-fast)] ease-[var(--ease-out-swiss)]",
    "active:translate-y-px motion-reduce:active:translate-y-0",
    "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        primary: "bg-ink text-on-ink hover:bg-ink/85",
        secondary: "border border-rule-strong text-ink hover:bg-subtle",
        ghost: "text-ink hover:bg-subtle",
        danger: "bg-danger text-white hover:bg-danger/90 dark:text-paper",
        link: "h-auto px-0 text-signal-progress underline decoration-1 underline-offset-4 hover:decoration-2",
      },
      size: {
        md: "h-11 px-5 text-small",
        sm: "h-9 px-3.5 text-small before:absolute before:-inset-1 before:content-['']",
        icon: "size-11",
        "icon-sm": "size-9 before:absolute before:-inset-1 before:content-['']",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
)

export type ButtonProps = ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }

export function Button({ className, variant, size, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"
  return (
    <Comp
      data-slot="button"
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
