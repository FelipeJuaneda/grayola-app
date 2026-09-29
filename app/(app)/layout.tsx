import { AppHeader } from "@/components/layout/app-header"
import { requireUser } from "@/lib/auth/session"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()

  return (
    <>
      <AppHeader user={user} />
      <main id="contenido" className="pb-20">
        {children}
      </main>
    </>
  )
}
