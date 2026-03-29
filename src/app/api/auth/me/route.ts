import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Return user data (excluding password)
    const { password, ...userWithoutPassword } = session.user;

    // Also update streak if needed (for daily visits without re-login)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastLogin = session.user.lastLoginDate ? new Date(session.user.lastLoginDate) : null;
    if (lastLogin) lastLogin.setHours(0, 0, 0, 0);

    let currentStreak = session.user.currentStreak;
    let longestStreak = session.user.longestStreak;

    if (lastLogin) {
      const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreak = session.user.currentStreak + 1;
        longestStreak = Math.max(currentStreak, session.user.longestStreak);
        await prisma.user.update({
          where: { id: session.user.id },
          data: { lastLoginDate: new Date(), currentStreak, longestStreak },
        });
      } else if (diffDays > 1) {
        currentStreak = 1;
        await prisma.user.update({
          where: { id: session.user.id },
          data: { lastLoginDate: new Date(), currentStreak: 1 },
        });
      }
    } else if (!lastLogin) {
      currentStreak = 1;
      await prisma.user.update({
        where: { id: session.user.id },
        data: { lastLoginDate: new Date(), currentStreak: 1, longestStreak: 1 },
      });
      longestStreak = 1;
    }

    return NextResponse.json({
      user: { ...userWithoutPassword, currentStreak, longestStreak },
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}