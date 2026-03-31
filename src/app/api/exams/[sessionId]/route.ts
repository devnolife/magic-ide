import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

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

    const examSession = await prisma.examSession.findUnique({
      where: { id: sessionId },
      include: {
        classroom: {
          include: { students: { select: { studentId: true } } },
        },
        quiz: {
          include: {
            questions: { orderBy: { order: 'asc' } },
            chapter: { select: { number: true, title: true } },
          },
        },
      },
    });

    if (!examSession) {
      return NextResponse.json(
        { error: 'Sesi ujian tidak ditemukan' },
        { status: 404 }
      );
    }

    const isStudent = examSession.classroom.students.some(
      (s) => s.studentId === userId
    );
    if (!isStudent) {
      return NextResponse.json(
        { error: 'Anda tidak terdaftar di kelas ini' },
        { status: 403 }
      );
    }

    // Check if student already submitted for this exam session
    const existingAttempt = await prisma.quizAttempt.findFirst({
      where: {
        userId,
        quizId: examSession.quizId,
        createdAt: { gte: examSession.startedAt ?? examSession.createdAt },
      },
    });

    // Sanitize questions — remove correct answers
    const sanitizedQuestions = examSession.quiz.questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      questionType: q.questionType,
      points: q.points,
      order: q.order,
      options: (() => {
        if (q.questionType === 'MULTIPLE_CHOICE' || q.questionType === 'TRUE_FALSE') {
          try {
            const opts = JSON.parse(q.options || '[]') as Array<{
              label: string;
              text: string;
            }>;
            return opts.map((o) => ({ label: o.label, text: o.text }));
          } catch {
            return [];
          }
        }
        if (q.questionType === 'MATCHING') {
          try {
            const parsed = JSON.parse(q.options || '{}') as {
              pairs?: Array<{ left: string; right: string }>;
            };
            const pairs = parsed.pairs ?? [];
            const leftItems = pairs.map((p) => p.left);
            // Shuffle right items so they don't match order
            const rightItems = [...pairs.map((p) => p.right)].sort(
              () => Math.random() - 0.5
            );
            return { leftItems, rightItems };
          } catch {
            return { leftItems: [], rightItems: [] };
          }
        }
        return null;
      })(),
    }));

    return NextResponse.json({
      session: {
        id: examSession.id,
        status: examSession.status,
        duration: examSession.duration ?? examSession.quiz.timeLimit,
        startedAt: examSession.startedAt,
        classroom: { name: examSession.classroom.name },
      },
      quiz: {
        id: examSession.quiz.id,
        title: examSession.quiz.title,
        description: examSession.quiz.description,
        chapter: examSession.quiz.chapter,
        questionCount: sanitizedQuestions.length,
        totalPoints: examSession.quiz.questions.reduce(
          (s, q) => s + q.points,
          0
        ),
      },
      questions: sanitizedQuestions,
      alreadySubmitted: !!existingAttempt,
      existingResult: existingAttempt
        ? {
            totalScore: existingAttempt.totalScore,
            maxScore: existingAttempt.maxScore,
            percentage: existingAttempt.percentage,
            status: existingAttempt.status,
            answers: (() => {
              try {
                return JSON.parse(existingAttempt.answers as string);
              } catch {
                return [];
              }
            })(),
          }
        : null,
    });
  } catch (error) {
    console.error('Exam session fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
