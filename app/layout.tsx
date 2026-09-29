import "./globals.css"

import type { Metadata, Viewport } from "next"
import { Archivo } from "next/font/google"

import { Providers } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/toaster"

// Grotesca variable con eje de ancho: el mismo tipo hace de texto (normal)
// y de numeral de cartel (expandido).
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Grayola · Proyectos de diseño", template: "%s · Grayola" },
  description:
    "Gestión de proyectos para un estudio de diseño: clientes que piden, un PM que asigna y diseñadores que entregan, cada uno con su vista y permisos reales.",
  applicationName: "Grayola",
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Grayola",
    title: "Grayola · Proyectos de diseño",
    description: "Del pedido a la entrega, sin perder el hilo. Caso de portfolio con Next.js y Supabase.",
  },
  twitter: { card: "summary_large_image" },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f3ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0e" },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" suppressHydrationWarning>
      <body className={archivo.variable}>
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[var(--z-toast)] focus:bg-ink focus:px-4 focus:py-3 focus:text-on-ink"
        >
          Saltar al contenido
        </a>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
