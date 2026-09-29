"use client"

import dynamic from "next/dynamic"

import type { ParticleFieldProps } from "./particle-field"

// Carga diferida y solo en el cliente: el engine no entra en el bundle
// inicial ni afecta LCP. Mientras carga no ocupa espacio (sin layout shift).
const ParticleField = dynamic(() => import("./particle-field"), { ssr: false, loading: () => null })

export function ParticleBackdrop(props: ParticleFieldProps) {
  return <ParticleField {...props} />
}
