import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

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
