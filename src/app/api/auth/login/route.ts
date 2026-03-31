import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePasswords, generateToken, createUserSession } from '@/lib/auth';
import { checkRateLimit, recordFailedAttempt, getClientIp } from '@/lib/rateLimit';

const LOGIN_RATE_LIMIT = { maxAttempts: 5, windowMs: 60 * 1000 };

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(ip, LOGIN_RATE_LIMIT);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: `Terlalu banyak percobaan login. Coba lagi dalam ${rateLimit.resetIn} detik.` },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.resetIn) },
        }
      );
    }

    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ],
        isActive: true,
      },
    });

    if (!user) {
      recordFailedAttempt(ip, LOGIN_RATE_LIMIT);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) {
      recordFailedAttempt(ip, LOGIN_RATE_LIMIT);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      isActivated: user.isActivated,
    });

    // Create session
    await createUserSession(user.id, token);

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
    if (lastLogin) lastLogin.setHours(0, 0, 0, 0);

    let newStreak = user.currentStreak;
    if (!lastLogin) {
      newStreak = 1;
    } else {
      const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak = user.currentStreak + 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
      // diffDays === 0 means same day, keep current streak
    }

    const newLongest = Math.max(newStreak, user.longestStreak);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginDate: new Date(),
        currentStreak: newStreak,
        longestStreak: newLongest,
      },
    });

    // Return user data (excluding password)
    const { password: _password, ...userWithoutPassword } = user;

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        ...userWithoutPassword,
        currentStreak: newStreak,
        longestStreak: newLongest,
      },
      token,
    });

    // Set auth cookie so middleware can read it on page navigations
    response.cookies.set('auth-token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}