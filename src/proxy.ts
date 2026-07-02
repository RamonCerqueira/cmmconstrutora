import * as jose from 'jose';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'cmm-construtora-secret-token-key-2026-high-standards-secure';
const COOKIE_NAME = 'cmm_session';
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  let user: { userId: number; email: string; role: string; name: string } | null = null;

  if (token) {
    try {
      const { payload } = await jose.jwtVerify(token, secretKey);
      user = payload as any;
    } catch (e) {
      // Token invalid or expired
    }
  }

  // Auth pages route check (prevent logged in users from visiting login/register)
  if (pathname.startsWith('/auth')) {
    if (user) {
      if (user.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard/rh', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard/candidato', request.url));
      }
    }
    return NextResponse.next();
  }

  // Dashboard RH routes protection
  if (pathname.startsWith('/dashboard/rh')) {
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth?mode=login&error=unauthorized', request.url));
    }
    return NextResponse.next();
  }

  // Dashboard Candidato routes protection
  if (pathname.startsWith('/dashboard/candidato')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth?mode=login&error=required', request.url));
    }
    // If admin is trying to access candidate dashboard, redirect to admin dashboard
    if (user.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/rh', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/dashboard/rh/:path*', '/dashboard/candidato/:path*'],
};
