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
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const chapterId = searchParams.get('chapterId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');
    const skip = (page - 1) * pageSize;

    const where = {
      isActive: true,
      ...(chapterId ? { chapterId } : {}),
    };

    const [quizzes, total] = await Promise.all([
      prisma.quiz.findMany({
        where,
        include: {
          chapter: {
            select: {
              id: true,
              title: true,
            },
          },
          questions: {
            select: {
              id: true,
              points: true,
            },
          },
          attempts: {
            where: { userId },
            orderBy: { percentage: 'desc' },
            take: 1,
            select: {
              id: true,
              totalScore: true,
              maxScore: true,
              percentage: true,
              status: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take: pageSize,
      }),
      prisma.quiz.count({ where }),
    ]);

    const result = quizzes.map((quiz) => ({
      id: quiz.id,
      chapterId: quiz.chapterId,
      title: quiz.title,
      description: quiz.description,
      timeLimit: quiz.timeLimit,
      isActive: quiz.isActive,
      createdAt: quiz.createdAt,
      chapter: quiz.chapter,
      questionCount: quiz.questions.length,
      totalPoints: quiz.questions.reduce((sum, q) => sum + q.points, 0),
      bestAttempt: quiz.attempts[0] || null,
    }));

    return NextResponse.json({
      quizzes: result,
      pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });

  } catch (error) {
    console.error('Quiz list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
