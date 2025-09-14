import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // CSP Header
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self' data:;
    connect-src 'self' ${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://0.0.0.0'};
    media-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()
  
  response.headers.set('Content-Security-Policy', cspHeader)
  
  // Rate limiting için IP kontrolü
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  
  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Login sayfası hariç token kontrolü
    if (!request.nextUrl.pathname.includes('/admin/login')) {
      // Client-side'da token kontrolü yapılacak
      // Burada sadece basic güvenlik kontrolü
    }
  }
  
  // API route protection
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Health check hariç diğer API'ler için rate limiting
    if (!request.nextUrl.pathname.includes('/api/health')) {
      // Rate limiting logic burada implement edilebilir
    }
  }
  
  return response
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}