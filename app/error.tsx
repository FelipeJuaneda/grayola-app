"use client"

import Link from "next/link"
import { useEffect } from "react"

import { Button, buttonVariants } from "@/components/ui/button"

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main id="contenido" className="container-swiss grid min-h-[70dvh] place-items-center py-12">
      <div className="grid w-full max-w-xl gap-6 border-t-2 border-danger pt-6">
        <p className="kicker text-danger">Algo falló</p>
        <h1 className="text-h1 font-bold">No pudimos cargar esta vista</h1>
        <p className="text-body text-ink-2">
          Puede ser un problema de conexión o del servidor. Tus datos no se perdieron: probá de nuevo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={reset}>Reintentar</Button>
          <Link href="/proyectos" className={buttonVariants({ variant: "secondary" })}>
            Ir a proyectos
          </Link>
        </div>
        {error.digest ? <p className="text-caption text-ink-2">Código de referencia: {error.digest}</p> : null}
      </div>
    </main>
  )
}
