import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth/session"

// El proxy ya redirige; esto cubre el caso sin proxy (p. ej. tests).
export default async function HomePage() {
  const user = await getCurrentUser()
  redirect(user ? "/proyectos" : "/login")
}
