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
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
          },
        },
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            questionText: true,
            questionType: true,
            options: true,
            points: true,
            order: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    if (!quiz.isActive) {
      return NextResponse.json(
        { error: 'Quiz is not available' },
        { status: 403 }
      );
    }

    // Strip isCorrect from options so students can't see answers
    const questions = quiz.questions.map((q) => {
      let sanitizedOptions = q.options;
      if (q.options) {
        try {
          const parsed = JSON.parse(q.options);
          if (Array.isArray(parsed)) {
            sanitizedOptions = JSON.stringify(
              parsed.map(({ isCorrect, ...rest }: { isCorrect?: boolean; [key: string]: unknown }) => rest)
            );
          }
        } catch {
          // options is not JSON, leave as-is
        }
      }
      return {
        ...q,
        options: sanitizedOptions,
      };
    });

    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        chapterId: quiz.chapterId,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        chapter: quiz.chapter,
        totalPoints,
        questionCount: questions.length,
        questions,
      },
    });

  } catch (error) {
    console.error('Quiz detail error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
