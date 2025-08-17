import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/auth';

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/chapter',
  '/chapter0',
  '/chapter1',
  '/chapter2',
  '/chapter3',
  '/chapter4',
  '/chapter5',
];

// Public routes that don't require authentication
const publicRoutes = [
  '/',           // Halaman utama sudah handle auth logic sendiri
  '/login',
  '/register',
];

// API routes that need auth
const protectedApiRoutes = [
  '/api/progress',
  '/api/analytics',
  '/api/time-tracking',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isProtectedApiRoute = protectedApiRoutes.some(route =>
    pathname.startsWith(route)
  );

  // Skip middleware for public routes and static files
  if (!isProtectedRoute && !isProtectedApiRoute) {
    return NextResponse.next();
  }

  // Get token from cookies
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    // For API routes, return 401
    if (isProtectedApiRoute) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // For pages, redirect to login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token
  const payload = verifyJWT(token);
  if (!payload) {
    // Clear invalid token and redirect
    const response = isProtectedApiRoute
      ? NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
      : NextResponse.redirect(new URL('/login', request.url));

    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });

    return response;
  }

  // Add user info to headers for API routes
  if (isProtectedApiRoute) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId);
    requestHeaders.set('x-session-id', payload.sessionId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints are public)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
