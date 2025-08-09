import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';

// Define protected routes
const protectedRoutes = ['/dashboard', '/chapter', '/admin'];
const adminRoutes = ['/admin'];
const publicRoutes = ['/', '/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));

  // Get token from Authorization header or cookies
  const authHeader = request.headers.get('authorization');
  const tokenFromHeader = authHeader?.replace('Bearer ', '');
  const tokenFromCookies = request.cookies.get('auth-token')?.value;
  const token = tokenFromHeader || tokenFromCookies;

  // If accessing a protected route
  if (isProtectedRoute) {
    if (!token) {
      // Redirect to login if no token
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const session = await validateSession(token);
      
      if (!session) {
        // Invalid or expired token
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth-token');
        return response;
      }

      // Check admin access
      if (isAdminRoute && session.user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Add user info to headers for API routes
      const response = NextResponse.next();
      response.headers.set('x-user-id', session.user.id);
      response.headers.set('x-user-role', session.user.role);
      
      return response;

    } catch (error) {
      console.error('Middleware auth error:', error);
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // If accessing login/register while already authenticated
  if ((pathname === '/login' || pathname === '/register') && token) {
    try {
      const session = await validateSession(token);
      if (session) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      // Invalid token, continue to login page
      console.error('Token validation error:', error);
    }
  }

  return NextResponse.next();
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};