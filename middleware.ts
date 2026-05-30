import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken, COOKIE_NAME } from './lib/auth'

const adminPaths = ['/admin', '/api/patients', '/api/medications', '/api/schedules', '/api/confirmations', '/api/reminders/trigger']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAdminPath = adminPaths.some((p) => pathname.startsWith(p))
  const isLoginPage = pathname === '/admin/login'
  const isAuthApi = pathname.startsWith('/api/auth')

  if (!isAdminPath || isLoginPage || isAuthApi) {
    return NextResponse.next()
  }

  const token = req.cookies.get(COOKIE_NAME)?.value
  const valid = token ? await verifyAdminToken(token) : false

  if (!valid) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/patients/:path*', '/api/medications/:path*', '/api/schedules/:path*', '/api/confirmations/:path*', '/api/reminders/trigger'],
}
