import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

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
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');

    const where = chapterId ? { chapterId } : {};

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        chapter: {
          select: {
            id: true,
            number: true,
            title: true,
          },
        },
      },
      orderBy: [
        { chapter: { number: 'asc' } },
        { number: 'asc' },
      ],
    });

    return NextResponse.json({ lessons });

  } catch (error) {
    console.error('Admin lessons fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { chapterId, number, title, description, content } = await request.json();

    if (!chapterId || !number || !title) {
      return NextResponse.json(
        { error: 'chapterId, number, and title are required' },
        { status: 400 }
      );
    }

    const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    const existing = await prisma.lesson.findUnique({
      where: { chapterId_number: { chapterId, number } },
    });
    if (existing) {
      return NextResponse.json(
        { error: 'A lesson with this number already exists in this chapter' },
        { status: 409 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        chapterId,
        number,
        title,
        description: description || null,
        content: content || null,
      },
      include: {
        chapter: {
          select: { id: true, number: true, title: true },
        },
      },
    });

    return NextResponse.json(
      { message: 'Lesson created successfully', lesson },
      { status: 201 }
    );

  } catch (error) {
    console.error('Admin lesson create error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
