import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

export async function GET(
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

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        chapter: {
          select: { id: true, number: true, title: true },
        },
        questions: { orderBy: { order: 'asc' } },
        _count: {
          select: { attempts: true },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ quiz });

  } catch (error) {
    console.error('Admin quiz fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const { chapterId, title, description, timeLimit, isActive, questions } = await request.json();

    const existing = await prisma.quiz.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    if (chapterId) {
      const chapter = await prisma.chapter.findUnique({ where: { id: chapterId } });
      if (!chapter) {
        return NextResponse.json(
          { error: 'Chapter not found' },
          { status: 404 }
        );
      }
    }

    const quiz = await prisma.$transaction(async (tx) => {
      // Replace all questions if provided
      if (questions) {
        await tx.question.deleteMany({ where: { quizId: id } });
        await tx.question.createMany({
          data: questions.map((q: { questionText: string; questionType?: string; options?: string; correctAnswer?: string; points?: number }, index: number) => ({
            quizId: id,
            questionText: q.questionText,
            questionType: q.questionType || 'MULTIPLE_CHOICE',
            options: q.options || null,
            correctAnswer: q.correctAnswer || null,
            points: q.points || 10,
            order: index,
          })),
        });
      }

      return tx.quiz.update({
        where: { id },
        data: {
          chapterId: chapterId || undefined,
          title: title || undefined,
          description: description !== undefined ? description : undefined,
          timeLimit: timeLimit !== undefined ? timeLimit : undefined,
          isActive: isActive !== undefined ? isActive : undefined,
        },
        include: {
          questions: { orderBy: { order: 'asc' } },
          chapter: {
            select: { id: true, number: true, title: true },
          },
        },
      });
    });

    return NextResponse.json({
      message: 'Quiz updated successfully',
      quiz,
    });

  } catch (error) {
    console.error('Admin quiz update error:', error);
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

    const existing = await prisma.quiz.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    await prisma.quiz.delete({ where: { id } });

    return NextResponse.json({
      message: 'Quiz deleted successfully',
    });

  } catch (error) {
    console.error('Admin quiz delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
