import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// La escala tipográfica propia (text-small, text-lead…) tiene que registrarse
// como tamaño de fuente; si no, tailwind-merge la confunde con un color y
// descarta clases como text-on-ink.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["caption", "small", "body", "lead", "h3", "h2", "h1", "display", "numeral"] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
