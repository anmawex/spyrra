import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Si intenta acceder a rutas protegidas sin la cookie "access_granted"
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/solicitar')) {
    const access = request.cookies.get('access_granted')
    
    if (!access) {
      return NextResponse.redirect(new URL('/login-demo', request.url))
    }
  }

  // Si intenta loguearse pero ya tiene acceso, mándalo al dashboard
  if (pathname === '/login-demo') {
    const access = request.cookies.get('access_granted')
    if (access) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/dashboard/:path*',
    '/solicitar/:path*',
    '/login-demo',
  ],
}
