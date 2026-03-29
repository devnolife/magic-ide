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
    const { chapterId, number, title, description, content, isActive } = await request.json();

    const existing = await prisma.lesson.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    const targetChapterId = chapterId || existing.chapterId;
    const targetNumber = number || existing.number;

    if (chapterId || number) {
      if (targetChapterId !== existing.chapterId || targetNumber !== existing.number) {
        const duplicate = await prisma.lesson.findUnique({
          where: { chapterId_number: { chapterId: targetChapterId, number: targetNumber } },
        });
        if (duplicate && duplicate.id !== id) {
          return NextResponse.json(
            { error: 'A lesson with this number already exists in this chapter' },
            { status: 409 }
          );
        }
      }
    }

    if (chapterId && chapterId !== existing.chapterId) {
      const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
      if (!chapter) {
        return NextResponse.json(
          { error: 'Chapter not found' },
          { status: 404 }
        );
      }
    }

    const lesson = await prisma.lesson.update({
      where: { id },
      data: {
        chapterId: chapterId || undefined,
        number: number || undefined,
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        content: content !== undefined ? content : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
      include: {
        chapter: {
          select: { id: true, number: true, title: true },
        },
      },
    });

    return NextResponse.json({
      message: 'Lesson updated successfully',
      lesson,
    });

  } catch (error) {
    console.error('Admin lesson update error:', error);
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

    const existing = await prisma.lesson.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    await prisma.lesson.delete({ where: { id } });

    return NextResponse.json({
      message: 'Lesson deleted successfully',
    });

  } catch (error) {
    console.error('Admin lesson delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
