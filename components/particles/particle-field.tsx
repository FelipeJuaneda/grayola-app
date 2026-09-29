"use client"

import type { Engine, ISourceOptions } from "@tsparticles/engine"
import { Particles, ParticlesProvider } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { useEffect, useId, useState } from "react"

import { cn } from "@/lib/utils"

export type ParticleIntensity = "hero" | "ambient"

export type ParticleFieldProps = {
  intensity?: ParticleIntensity
  className?: string
}

// Estable durante toda la vida de la app (lo exige ParticlesProvider).
const initEngine = async (engine: Engine) => {
  await loadSlim(engine)
}

type Tokens = { ink: string; accent: string; link: string }

// Los colores salen de tokens CSS (--particle-*). El tema oscuro no cambia
// estas opciones: lo resuelve --particle-filter con una transición de CSS,
// así la instancia no se reinicia ni parpadea al alternar el tema.
function readTokens(): Tokens {
  const styles = getComputedStyle(document.documentElement)
  const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback
  return {
    ink: read("--particle-ink", "#121212"),
    accent: read("--particle-accent", "#1f3fd1"),
    link: read("--particle-link", "#121212"),
  }
}

// Variante "Ruta": nodos cuadrados de la grilla que se enlazan como la ruta
// cliente → PM → diseñador; algunos nodos en cobalto marcan rutas activas y
// el cursor "toma" las conexiones cercanas (grab) en la versión hero.
function buildOptions(
  intensity: ParticleIntensity,
  tokens: Tokens,
  { reducedMotion, compact }: { reducedMotion: boolean; compact: boolean },
): ISourceOptions {
  const hero = intensity === "hero"
  // Con densidad activa, el valor escala con el área: la banda "ambient" es
  // baja, así que necesita un valor base más alto para verse.
  const count = hero ? (compact ? 22 : 58) : compact ? 30 : 64

  return {
    fullScreen: { enable: false },
    detectRetina: true,
    fpsLimit: hero ? 60 : 30,
    pauseOnBlur: true,
    pauseOnOutsideViewport: true,
    particles: {
      number: { value: count, density: { enable: true, width: 1440, height: 900 } },
      paint: {
        fill: { enable: true, color: { value: [tokens.ink, tokens.ink, tokens.ink, tokens.accent] } },
      },
      shape: { type: "square" },
      size: { value: { min: 1.5, max: hero ? 3.5 : 2.5 } },
      opacity: { value: { min: 0.35, max: 0.85 } },
      links: {
        enable: true,
        distance: hero ? 150 : 120,
        color: tokens.link,
        opacity: hero ? 0.16 : 0.1,
        width: 1,
      },
      move: {
        enable: !reducedMotion,
        speed: hero ? 0.35 : 0.18,
        direction: "none",
        outModes: { default: "out" },
      },
    },
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: { enable: hero && !reducedMotion && !compact, mode: "grab" },
        onClick: { enable: false },
        resize: { enable: true, delay: 0.3 },
      },
      modes: {
        grab: { distance: 170, links: { opacity: 0.45, color: tokens.accent } },
      },
    },
  }
}

export default function ParticleField({ intensity = "ambient", className }: ParticleFieldProps) {
  const id = useId().replace(/:/g, "")
  const [options, setOptions] = useState<ISourceOptions | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const compact = window.matchMedia("(max-width: 767px)")
    const build = () =>
      setOptions(
        buildOptions(intensity, readTokens(), { reducedMotion: reduced.matches, compact: compact.matches }),
      )

    build()
    reduced.addEventListener("change", build)
    compact.addEventListener("change", build)
    return () => {
      reduced.removeEventListener("change", build)
      compact.removeEventListener("change", build)
    }
  }, [intensity])

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        "[filter:var(--particle-filter)] transition-[filter,opacity] duration-[var(--duration-slow)] ease-[var(--ease-out-swiss)]",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {options ? (
        <ParticlesProvider init={initEngine}>
          <Particles
            id={`particles-${id}`}
            options={options}
            className="size-full"
            particlesLoaded={() => setVisible(true)}
          />
        </ParticlesProvider>
      ) : null}
    </div>
  )
}
