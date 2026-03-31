import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { generateToken, verifyToken, createUserSession, type JWTPayload } from '@/lib/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-dev-only';

const ONE_DAY_SECONDS = 24 * 60 * 60;

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const tokenFromHeader = authHeader?.replace('Bearer ', '');
    const tokenFromCookies = request.cookies.get('auth-token')?.value;
    const token = tokenFromHeader || tokenFromCookies;

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    let payload: JWTPayload | null = verifyToken(token);
    let fromGracePeriod = false;

    if (!payload) {
      // Token is invalid or expired — check if within 1-day grace period
      try {
        const decoded = jwt.decode(token) as (JWTPayload & { exp?: number }) | null;
        if (!decoded || !decoded.exp) {
          return NextResponse.json(
            { error: 'Invalid token' },
            { status: 401 }
          );
        }

        const now = Math.floor(Date.now() / 1000);
        const expiredAgo = now - decoded.exp;

        if (expiredAgo > ONE_DAY_SECONDS) {
          return NextResponse.json(
            { error: 'Token expired beyond grace period' },
            { status: 401 }
          );
        }

        payload = {
          userId: decoded.userId,
          username: decoded.username,
          role: decoded.role,
          isActivated: decoded.isActivated,
        };
        fromGracePeriod = true;
      } catch {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }
    }

    // Verify user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: payload.userId, isActive: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found or deactivated' },
        { status: 401 }
      );
    }

    // Generate new token with fresh payload from DB
    const newToken = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      isActivated: user.isActivated,
    });

    // Clean up old session if refreshing from grace period
    if (fromGracePeriod) {
      await prisma.userSession.deleteMany({ where: { token } }).catch(() => {});
    }

    // Create new session
    await createUserSession(user.id, newToken);

    const response = NextResponse.json({
      message: 'Token refreshed',
      token: newToken,
    });

    response.cookies.set('auth-token', newToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
