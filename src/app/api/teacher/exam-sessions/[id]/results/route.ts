import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

export async function GET(
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
        classroom: {
          include: {
            students: {
              include: {
                student: {
                  select: { id: true, name: true, username: true },
                },
              },
            },
          },
        },
        quiz: {
          include: {
            questions: { orderBy: { order: 'asc' } },
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

    const studentIds = examSession.classroom.students.map(
      (s) => s.student.id
    );

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        quizId: examSession.quizId,
        userId: { in: studentIds },
      },
    });

    const attemptsByUserId = new Map(
      attempts.map((a) => [a.userId, a])
    );

    const questionsMap = new Map(
      examSession.quiz.questions.map((q) => [q.id, q])
    );

    const totalPoints = examSession.quiz.questions.reduce(
      (sum, q) => sum + q.points,
      0
    );

    const students = examSession.classroom.students.map((cs) => {
      const student = cs.student;
      const attempt = attemptsByUserId.get(student.id);

      if (!attempt) {
        return {
          id: student.id,
          name: student.name,
          username: student.username,
          attempt: null,
        };
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
        parsedAnswers = [];
      }

      const answers = parsedAnswers.map((ans) => {
        const question = questionsMap.get(ans.questionId);
        return {
          questionId: ans.questionId,
          questionText: question?.questionText ?? '',
          questionType: question?.questionType ?? 'MULTIPLE_CHOICE',
          answer: ans.answer,
          isCorrect: ans.isCorrect,
          points: ans.points,
          maxPoints: question?.points ?? 0,
          correctAnswer: question?.correctAnswer ?? null,
        };
      });

      return {
        id: student.id,
        name: student.name,
        username: student.username,
        attempt: {
          id: attempt.id,
          totalScore: attempt.totalScore,
          maxScore: attempt.maxScore,
          percentage: attempt.percentage,
          timeSpent: attempt.timeSpent,
          status: attempt.status,
          createdAt: attempt.createdAt,
          answers,
        },
      };
    });

    const attemptedStudents = students.filter((s) => s.attempt !== null);
    const scores = attemptedStudents.map(
      (s) => s.attempt!.percentage
    );

    const summary = {
      totalStudents: students.length,
      attempted: attemptedStudents.length,
      notAttempted: students.length - attemptedStudents.length,
      averageScore:
        scores.length > 0
          ? Math.round(
              (scores.reduce((a, b) => a + b, 0) / scores.length) * 100
            ) / 100
          : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
      passCount: scores.filter((s) => s >= 60).length,
      failCount: scores.filter((s) => s < 60).length,
    };

    return NextResponse.json({
      session: {
        id: examSession.id,
        status: examSession.status,
        quiz: {
          id: examSession.quiz.id,
          title: examSession.quiz.title,
          totalPoints,
        },
        classroom: {
          id: examSession.classroom.id,
          name: examSession.classroom.name,
        },
      },
      students,
      summary,
    });
  } catch (error) {
    console.error('Exam results fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
