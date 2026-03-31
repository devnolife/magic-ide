import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = session.user.id;

    const classrooms = await prisma.classroomStudent.findMany({
      where: { studentId: userId },
      select: { classroomId: true },
    });

    const classroomIds = classrooms.map((c) => c.classroomId);

    if (classroomIds.length === 0) {
      return NextResponse.json({ sessions: [] });
    }

    const activeSessions = await prisma.examSession.findMany({
      where: {
        classroomId: { in: classroomIds },
        status: 'ACTIVE',
      },
      include: {
        quiz: { select: { id: true, title: true, description: true } },
        classroom: { select: { id: true, name: true } },
      },
      orderBy: { startedAt: 'desc' },
    });

    const existingAttempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        quizId: { in: activeSessions.map((s) => s.quizId) },
      },
      select: { quizId: true },
    });

    const attemptedQuizIds = new Set(existingAttempts.map((a) => a.quizId));

    const sessions = activeSessions.map((s) => ({
      id: s.id,
      quizTitle: s.quiz.title,
      quizDescription: s.quiz.description,
      classroomName: s.classroom.name,
      duration: s.duration,
      startedAt: s.startedAt,
      alreadySubmitted: attemptedQuizIds.has(s.quizId),
    }));

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching active exams:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
