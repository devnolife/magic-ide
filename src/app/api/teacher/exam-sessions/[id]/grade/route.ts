import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const { role, id: userId } = session.user;

    if (role !== 'TEACHER' && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Teacher or admin access required' },
        { status: 403 }
      );
    }

    const examSession = await prisma.examSession.findUnique({
      where: { id },
      include: {
        classroom: true,
        quiz: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!examSession) {
      return NextResponse.json(
        { error: 'Exam session not found' },
        { status: 404 }
      );
    }

    if (role === 'TEACHER' && examSession.classroom.teacherId !== userId) {
      return NextResponse.json(
        { error: 'You do not have access to this exam session' },
        { status: 403 }
      );
    }

    const { attemptId, questionId, newScore } = await request.json();

    if (!attemptId || !questionId || newScore === undefined || newScore === null) {
      return NextResponse.json(
        { error: 'attemptId, questionId, and newScore are required' },
        { status: 400 }
      );
    }

    if (typeof newScore !== 'number' || newScore < 0) {
      return NextResponse.json(
        { error: 'newScore must be a non-negative number' },
        { status: 400 }
      );
    }

    const question = examSession.quiz.questions.find(
      (q) => q.id === questionId
    );

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found in this quiz' },
        { status: 404 }
      );
    }

    if (newScore > question.points) {
      return NextResponse.json(
        { error: `newScore cannot exceed maximum points (${question.points})` },
        { status: 400 }
      );
    }

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: 'Quiz attempt not found' },
        { status: 404 }
      );
    }

    if (attempt.quizId !== examSession.quizId) {
      return NextResponse.json(
        { error: 'This attempt does not belong to the exam session quiz' },
        { status: 400 }
      );
    }

    let parsedAnswers: Array<{
      questionId: string;
      answer: string;
      isCorrect: boolean;
      points: number;
    }> = [];

    try {
      parsedAnswers = attempt.answers ? JSON.parse(attempt.answers) : [];
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse attempt answers' },
        { status: 500 }
      );
    }

    const answerIndex = parsedAnswers.findIndex(
      (a) => a.questionId === questionId
    );

    if (answerIndex === -1) {
      return NextResponse.json(
        { error: 'Answer for this question not found in the attempt' },
        { status: 404 }
      );
    }

    parsedAnswers[answerIndex].points = newScore;
    parsedAnswers[answerIndex].isCorrect = newScore > 0;

    const totalScore = parsedAnswers.reduce((sum, a) => sum + a.points, 0);
    const maxScore = attempt.maxScore;
    const percentage =
      maxScore > 0 ? Math.round((totalScore / maxScore) * 10000) / 100 : 0;
    const status = percentage >= 60 ? 'COMPLETED' : 'FAILED';

    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        answers: JSON.stringify(parsedAnswers),
        totalScore,
        percentage,
        status,
      },
    });

    return NextResponse.json({
      message: 'Skor berhasil diperbarui',
      attempt: {
        totalScore: updatedAttempt.totalScore,
        maxScore: updatedAttempt.maxScore,
        percentage: updatedAttempt.percentage,
        status: updatedAttempt.status,
      },
    });
  } catch (error) {
    console.error('Grade update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
