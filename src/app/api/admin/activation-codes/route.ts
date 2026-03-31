import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

// GET - List all activation codes with usage stats
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
    const session = await validateSession(token);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const codes = await prisma.activationCode.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { usages: true } },
      },
    });

    return NextResponse.json({ codes });
  } catch (error) {
    console.error('Error fetching activation codes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new activation code
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
    const session = await validateSession(token);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { code, description, maxUses, expiresAt } = await request.json();

    if (!code || !code.trim()) {
      return NextResponse.json({ error: 'Kode aktivasi wajib diisi' }, { status: 400 });
    }

    // Check if code already exists
    const existing = await prisma.activationCode.findUnique({ where: { code: code.trim().toUpperCase() } });
    if (existing) {
      return NextResponse.json({ error: 'Kode sudah digunakan' }, { status: 409 });
    }

    const newCode = await prisma.activationCode.create({
      data: {
        code: code.trim().toUpperCase(),
        description: description || null,
        maxUses: maxUses || 1,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({ code: newCode }, { status: 201 });
  } catch (error) {
    console.error('Error creating activation code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
