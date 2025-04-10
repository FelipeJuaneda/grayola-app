import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  console.log("🚀 ~ middleware ~ session:", session)

  const isProtectedRoute = req.nextUrl.pathname.startsWith('/proyectos');

  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
