import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { number, title, description, isActive } = await request.json();

    const existing = await prisma.chapter.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    if (number && number !== existing.number) {
      const duplicate = await prisma.chapter.findUnique({ where: { number } });
      if (duplicate) {
        return NextResponse.json(
          { error: 'A chapter with this number already exists' },
          { status: 409 }
        );
      }
    }

    const chapter = await prisma.chapter.update({
      where: { id },
      data: {
        number: number || undefined,
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    return NextResponse.json({
      message: 'Chapter updated successfully',
      chapter,
    });

  } catch (error) {
    console.error('Admin chapter update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const existing = await prisma.chapter.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    await prisma.chapter.delete({ where: { id } });

    return NextResponse.json({
      message: 'Chapter deleted successfully',
    });

  } catch (error) {
    console.error('Admin chapter delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
