import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken, createUserSession } from '@/lib/auth';
import { checkRateLimit, recordFailedAttempt, getClientIp } from '@/lib/rateLimit';

const REGISTER_RATE_LIMIT = { maxAttempts: 3, windowMs: 5 * 60 * 1000 };

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(ip, REGISTER_RATE_LIMIT);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Terlalu banyak percobaan registrasi. Coba lagi nanti.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateLimit.resetIn) },
        }
      );
    }

    const { username, email, password, name, activationCode } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    // Validate activation code if provided
    let validCode = null;
    let isActivated = false;
    if (activationCode && activationCode.trim()) {
      validCode = await prisma.activationCode.findUnique({
        where: { code: activationCode.trim().toUpperCase() },
      });

      if (!validCode) {
        return NextResponse.json({ error: 'Kode aktivasi tidak ditemukan' }, { status: 400 });
      }
      if (!validCode.isActive) {
        return NextResponse.json({ error: 'Kode aktivasi sudah tidak aktif' }, { status: 400 });
      }
      if (validCode.currentUses >= validCode.maxUses) {
        return NextResponse.json({ error: 'Kode aktivasi sudah mencapai batas penggunaan' }, { status: 400 });
      }
      if (validCode.expiresAt && validCode.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Kode aktivasi sudah kadaluarsa' }, { status: 400 });
      }
      isActivated = true;
    }

    const hashedPassword = await hashPassword(password);

    const userRole = isActivated ? 'TEACHER' : 'USER';

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name,
        role: userRole,
        isActivated,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        isActivated: true,
        createdAt: true,
      },
    });

    // If activation code was valid, record usage and increment counter
    if (validCode) {
      await prisma.$transaction([
        prisma.activationCodeUsage.create({
          data: { codeId: validCode.id, userId: user.id },
        }),
        prisma.activationCode.update({
          where: { id: validCode.id },
          data: { currentUses: { increment: 1 } },
        }),
      ]);
    }

    recordFailedAttempt(ip, REGISTER_RATE_LIMIT);

    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role,
      isActivated: user.isActivated,
    });

    await createUserSession(user.id, token);

    const response = NextResponse.json({
      message: 'User created successfully',
      user,
      token,
    });

    response.cookies.set('auth-token', token, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}