import Link from "next/link"

import { Wordmark } from "@/components/brand/wordmark"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <main id="contenido" className="container-swiss grid min-h-dvh content-between py-8">
      <Wordmark />
      <div className="grid-rules grid gap-8 border-t-2 border-rule-strong py-12 md:grid-cols-[auto_minmax(0,1fr)] md:items-end md:gap-12">
        <p aria-hidden="true" className="numeral text-[6rem] leading-[0.8] text-ink-3 md:text-[11rem]">
          404
        </p>
        <div className="grid max-w-md gap-4">
          <h1 className="text-h1 font-bold">No encontramos esta página</h1>
          <p className="text-body text-ink-2">
            Puede que el proyecto se haya eliminado o que no tengas acceso a él con tu rol.
          </p>
          <div>
            <Link href="/proyectos" className={buttonVariants()}>
              Volver a proyectos
            </Link>
          </div>
        </div>
      </div>
      <p className="text-caption text-ink-2">Error 404</p>
    </main>
  )
}
