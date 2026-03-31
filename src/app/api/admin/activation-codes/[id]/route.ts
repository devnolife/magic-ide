import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

// GET - Get single activation code with usage details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
    const session = await validateSession(token);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    const code = await prisma.activationCode.findUnique({
      where: { id },
      include: {
        usages: {
          include: {
            user: {
              select: { id: true, username: true, name: true, email: true, role: true, createdAt: true },
            },
          },
          orderBy: { activatedAt: 'desc' },
        },
        _count: { select: { usages: true } },
      },
    });

    if (!code) {
      return NextResponse.json({ error: 'Kode tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error fetching activation code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH - Update activation code (toggle active, update maxUses, description)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
    const session = await validateSession(token);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (typeof body.isActive === 'boolean') updateData.isActive = body.isActive;
    if (typeof body.maxUses === 'number') updateData.maxUses = body.maxUses;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.expiresAt !== undefined) updateData.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

    const updated = await prisma.activationCode.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ code: updated });
  } catch (error) {
    console.error('Error updating activation code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete activation code
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
    const session = await validateSession(token);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    await prisma.activationCode.delete({ where: { id } });

    return NextResponse.json({ message: 'Kode berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting activation code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
