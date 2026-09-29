"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

// Toasts de Sonner con los tokens del tema (tinta sobre papel, filete de estado).
export function Toaster() {
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!rounded-md !border !border-rule !bg-surface !text-ink !shadow-overlay !font-sans !text-small",
          description: "!text-ink-2",
          success: "!border-l-4 !border-l-signal-done",
          error: "!border-l-4 !border-l-danger",
          actionButton: "!bg-ink !text-on-ink !rounded-sm !font-semibold",
          closeButton: "!bg-surface !border-rule !text-ink",
        },
      }}
      style={{ zIndex: "var(--z-toast)" } as React.CSSProperties}
    />
  )
}
