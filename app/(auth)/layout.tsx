import { Wordmark } from "@/components/brand/wordmark"
import { ParticleBackdrop } from "@/components/particles/particle-backdrop"
import { ThemeToggle } from "@/components/theme/theme-toggle"

const ROUTE = ["Cliente", "PM", "Diseño"]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <aside className="grid-rules relative isolate flex min-h-60 flex-col justify-between overflow-hidden border-b border-rule p-6 md:min-h-72 md:p-10 lg:min-h-dvh lg:border-r lg:border-b-0">
        {/* Las partículas se desvanecen hacia el texto para no bajarle contraste */}
        <ParticleBackdrop
          intensity="hero"
          className="[mask-image:linear-gradient(to_top_right,transparent_18%,black_62%)]"
        />
        <div className="relative flex items-center justify-between gap-4">
          <Wordmark href="/login" />
          <ThemeToggle />
        </div>

        <div className="relative mt-10 grid max-w-xl gap-5">
          <p className="kicker">Gestión de proyectos de diseño</p>
          <h1 className="text-h1 leading-[1.05] font-bold tracking-[-0.02em] md:text-display lg:text-[3.5rem]">
            Del pedido a la entrega, sin perder el hilo.
          </h1>
          <p className="hidden max-w-md text-lead text-ink-2 md:block">
            Clientes, project managers y diseñadores comparten cada proyecto: quién lo tiene, en qué etapa está y qué
            vence primero.
          </p>
          <ol
            className="hidden items-center gap-3 text-small font-semibold md:flex"
            aria-label="Recorrido de un proyecto"
          >
            {ROUTE.map((step, index) => (
              <li key={step} className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={index === 1 ? "size-2.5 bg-signal-progress" : "size-2.5 bg-ink"}
                  />
                  {step}
                </span>
                {index < ROUTE.length - 1 ? <span aria-hidden="true" className="h-px w-10 bg-rule-strong" /> : null}
              </li>
            ))}
          </ol>
        </div>

        <p className="relative mt-8 hidden text-caption text-ink-2 lg:block">
          Caso de portfolio · Todos los datos son de demostración.
        </p>
      </aside>

      <main id="contenido" className="flex items-start justify-center bg-paper px-4 py-10 md:px-10 lg:items-center">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  )
}
