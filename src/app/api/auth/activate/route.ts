import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession, generateToken, createUserSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user;

    if (user.isActivated) {
      return NextResponse.json({ error: 'Akun sudah teraktivasi' }, { status: 400 });
    }

    const { activationCode } = await request.json();

    if (!activationCode || !activationCode.trim()) {
      return NextResponse.json({ error: 'Kode aktivasi wajib diisi' }, { status: 400 });
    }

    const code = await prisma.activationCode.findUnique({
      where: { code: activationCode.trim().toUpperCase() },
    });

    if (!code) {
      return NextResponse.json({ error: 'Kode aktivasi tidak ditemukan' }, { status: 400 });
    }
    if (!code.isActive) {
      return NextResponse.json({ error: 'Kode aktivasi sudah tidak aktif' }, { status: 400 });
    }
    if (code.currentUses >= code.maxUses) {
      return NextResponse.json({ error: 'Kode aktivasi sudah mencapai batas penggunaan' }, { status: 400 });
    }
    if (code.expiresAt && code.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Kode aktivasi sudah kadaluarsa' }, { status: 400 });
    }

    // Check if user already used this code
    const existingUsage = await prisma.activationCodeUsage.findUnique({
      where: { codeId_userId: { codeId: code.id, userId: user.id } },
    });
    if (existingUsage) {
      return NextResponse.json({ error: 'Anda sudah pernah menggunakan kode ini' }, { status: 400 });
    }

    // Activate user, set role to TEACHER, and record usage
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { isActivated: true, role: 'TEACHER' },
      }),
      prisma.activationCodeUsage.create({
        data: { codeId: code.id, userId: user.id },
      }),
      prisma.activationCode.update({
        where: { id: code.id },
        data: { currentUses: { increment: 1 } },
      }),
    ]);

    // Generate new token with isActivated=true and TEACHER role
    const newToken = generateToken({
      userId: user.id,
      username: user.username,
      role: 'TEACHER',
      isActivated: true,
    });

    await createUserSession(user.id, newToken);

    const response = NextResponse.json({
      message: 'Aktivasi berhasil! Anda sekarang memiliki akses penuh.',
      token: newToken,
      isActivated: true,
    });

    response.cookies.set('auth-token', newToken, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
      httpOnly: false,
    });

    return response;
  } catch (error) {
    console.error('Activation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
