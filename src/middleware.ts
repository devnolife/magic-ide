import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET not set. Using default secret for development only.');
}
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-dev-only'
);

// Define protected routes
const protectedRoutes = ['/dashboard', '/chapter', '/admin', '/teacher', '/leaderboard', '/certificates', '/exam'];
const adminRoutes = ['/admin'];
const teacherRoutes = ['/teacher'];

interface JWTPayload {
  userId: string;
  username: string;
  role: string;
  isActivated?: boolean;
}

async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isTeacherRoute = teacherRoutes.some(route => pathname.startsWith(route));

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

    const payload = await verifyJWT(token);

    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }

    const userRole = payload.role;

    // Check admin access
    if (isAdminRoute && userRole !== 'ADMIN') {
      const redirectUrl = userRole === 'TEACHER' ? '/teacher' : '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Check teacher access
    if (isTeacherRoute && userRole !== 'TEACHER' && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect TEACHER from student routes to teacher equivalents
    if (userRole === 'TEACHER') {
      if (pathname === '/dashboard') {
        return NextResponse.redirect(new URL('/teacher', request.url));
      }
      if (pathname.startsWith('/chapter/')) {
        const chapterMatch = pathname.match(/^\/chapter\/(\d+)/);
        if (chapterMatch) {
          return NextResponse.redirect(new URL(`/teacher/materials/${chapterMatch[1]}`, request.url));
        }
      }
    }

    // Restrict non-activated TEACHER access
    if (userRole === 'TEACHER' && !payload.isActivated) {
      const allowedPaths = [
        '/teacher',
        '/teacher/materials',
        '/teacher/materials/0',
        '/teacher/materials/1',
        '/teacher/activate',
        '/teacher/profile',
      ];

      const isAllowed = allowedPaths.some(path => pathname === path) ||
        pathname.startsWith('/teacher/materials/0/') ||
        pathname.startsWith('/teacher/materials/1/');

      if (!isAllowed && pathname.startsWith('/teacher')) {
        return NextResponse.redirect(new URL('/teacher/activate', request.url));
      }
    }

    // Add user info to headers for downstream use
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.userId);
    response.headers.set('x-user-role', payload.role);
    response.headers.set('x-user-activated', String(payload.isActivated ?? false));

    return response;
  }

  // If accessing login/register while already authenticated, redirect by role
  if ((pathname === '/login' || pathname === '/register') && token) {
    const payload = await verifyJWT(token);
    if (payload) {
      const redirectUrl = payload.role === 'ADMIN' ? '/admin' : payload.role === 'TEACHER' ? '/teacher' : '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
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