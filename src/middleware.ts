import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';

// Define protected routes
const protectedRoutes = ['/dashboard', '/chapter', '/admin', '/teacher'];
const adminRoutes = ['/admin'];
const teacherRoutes = ['/teacher'];
const publicRoutes = ['/', '/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isTeacherRoute = teacherRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route));

  // Get token from Authorization header or cookies
  const authHeader = request.headers.get('authorization');
  const tokenFromHeader = authHeader?.replace('Bearer ', '');
  const tokenFromCookies = request.cookies.get('auth-token')?.value;
  const token = tokenFromHeader || tokenFromCookies;

  // If accessing a protected route
  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const session = await validateSession(token);
      
      if (!session) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth-token');
        return response;
      }

      const userRole = session.user.role;

      // Check admin access
      if (isAdminRoute && userRole !== 'ADMIN') {
        const redirectUrl = userRole === 'TEACHER' ? '/teacher' : '/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }

      // Check teacher access
      if (isTeacherRoute && userRole !== 'TEACHER' && userRole !== 'ADMIN') {
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

  // If accessing login/register while already authenticated, redirect by role
  if ((pathname === '/login' || pathname === '/register') && token) {
    try {
      const session = await validateSession(token);
      if (session) {
        const role = session.user.role;
        const redirectUrl = role === 'ADMIN' ? '/admin' : role === 'TEACHER' ? '/teacher' : '/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    } catch (error) {
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