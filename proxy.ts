import type { NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/proxy"

export async function proxy(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    // Todo salvo rutas de API (el cron de keep-alive), assets estáticos e imágenes.
    "/((?!api/|_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
