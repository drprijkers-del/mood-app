import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // Handle super-admin routes - require super admin session
  if (pathname.startsWith('/super-admin') && !pathname.startsWith('/super-admin/login')) {
    const sessionCookie = request.cookies.get('super_admin_session')?.value

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/super-admin/login', request.url))
    }

    try {
      const session = JSON.parse(sessionCookie)
      if (session.exp < Date.now()) {
        const response = NextResponse.redirect(new URL('/super-admin/login', request.url))
        response.cookies.delete('super_admin_session')
        return response
      }
    } catch {
      return NextResponse.redirect(new URL('/super-admin/login', request.url))
    }

    return NextResponse.next()
  }

  // Handle admin routes - require authentication
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const { user, supabaseResponse } = await updateSession(request)

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return supabaseResponse
  }

  // Handle team invite links with token
  if (pathname.startsWith('/t/') && searchParams.has('k')) {
    // Let the page handle token validation and cookie setting
    // Then redirect to clean URL
    const { user, supabaseResponse } = await updateSession(request)
    return supabaseResponse
  }

  // Default: update session for all other routes
  const { supabaseResponse } = await updateSession(request)
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
