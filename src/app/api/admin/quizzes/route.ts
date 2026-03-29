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

    const quizzes = await prisma.quiz.findMany({
      where,
      include: {
        chapter: {
          select: {
            id: true,
            number: true,
            title: true,
          },
        },
        _count: {
          select: {
            questions: true,
            attempts: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ quizzes });

  } catch (error) {
    console.error('Admin quizzes fetch error:', error);
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

    const { chapterId, title, description, timeLimit, questions } = await request.json();

    if (!chapterId || !title) {
      return NextResponse.json(
        { error: 'chapterId and title are required' },
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

    const quiz = await prisma.quiz.create({
      data: {
        chapterId,
        title,
        description: description || null,
        timeLimit: timeLimit || null,
        questions: {
          create: (questions || []).map((q: { questionText: string; questionType?: string; options?: string; correctAnswer?: string; points?: number }, index: number) => ({
            questionText: q.questionText,
            questionType: q.questionType || 'MULTIPLE_CHOICE',
            options: q.options || null,
            correctAnswer: q.correctAnswer || null,
            points: q.points || 10,
            order: index,
          })),
        },
      },
      include: {
        questions: { orderBy: { order: 'asc' } },
        chapter: {
          select: { id: true, number: true, title: true },
        },
      },
    });

    return NextResponse.json(
      { message: 'Quiz created successfully', quiz },
      { status: 201 }
    );

  } catch (error) {
    console.error('Admin quiz create error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
