import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

interface AnswerInput {
  questionId: string;
  answer: string;
}

interface GradedAnswer {
  questionId: string;
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  correctAnswer: string | null;
  userAnswer: string;
}

function checkAnswer(
  questionType: string,
  userAnswer: string,
  correctAnswer: string | null,
  options: string | null,
  maxPoints: number
): { isCorrect: boolean; earnedPoints: number; maxPoints: number } {
  const trimmedAnswer = userAnswer.trim();
  const trimmedCorrect = (correctAnswer ?? '').trim();

  switch (questionType) {
    case 'MULTIPLE_CHOICE': {
      const isCorrect =
        trimmedAnswer.toLowerCase() === trimmedCorrect.toLowerCase();
      return { isCorrect, earnedPoints: isCorrect ? maxPoints : 0, maxPoints };
    }

    case 'TRUE_FALSE': {
      const isCorrect =
        trimmedAnswer.toLowerCase() === trimmedCorrect.toLowerCase();
      return { isCorrect, earnedPoints: isCorrect ? maxPoints : 0, maxPoints };
    }

    case 'SHORT_ANSWER': {
      const isCorrect =
        trimmedAnswer.toLowerCase() === trimmedCorrect.toLowerCase();
      return { isCorrect, earnedPoints: isCorrect ? maxPoints : 0, maxPoints };
    }

    case 'ESSAY': {
      if (!options) {
        return { isCorrect: false, earnedPoints: 0, maxPoints };
      }
      try {
        const parsed = JSON.parse(options) as { keywords?: string[] };
        const keywords = parsed.keywords ?? [];
        if (keywords.length === 0) {
          return { isCorrect: false, earnedPoints: 0, maxPoints };
        }
        const lowerAnswer = trimmedAnswer.toLowerCase();
        const matchedCount = keywords.filter((kw) =>
          lowerAnswer.includes(kw.toLowerCase())
        ).length;
        const earnedPoints = Math.round(
          (matchedCount / keywords.length) * maxPoints
        );
        return { isCorrect: earnedPoints > 0, earnedPoints, maxPoints };
      } catch {
        return { isCorrect: false, earnedPoints: 0, maxPoints };
      }
    }

    case 'MATCHING': {
      if (!options) {
        return { isCorrect: false, earnedPoints: 0, maxPoints };
      }
      try {
        const parsed = JSON.parse(options) as {
          pairs?: Array<{ left: string; right: string }>;
        };
        const pairs = parsed.pairs ?? [];
        if (pairs.length === 0) {
          return { isCorrect: false, earnedPoints: 0, maxPoints };
        }

        let studentPairs: Record<string, string> = {};
        try {
          studentPairs = JSON.parse(trimmedAnswer) as Record<string, string>;
        } catch {
          return { isCorrect: false, earnedPoints: 0, maxPoints };
        }

        const correctCount = pairs.filter((pair) => {
          const studentRight = studentPairs[pair.left];
          if (!studentRight) return false;
          return studentRight.toLowerCase() === pair.right.toLowerCase();
        }).length;

        const earnedPoints = Math.round(
          (correctCount / pairs.length) * maxPoints
        );
        return {
          isCorrect: correctCount === pairs.length,
          earnedPoints,
          maxPoints,
        };
      } catch {
        return { isCorrect: false, earnedPoints: 0, maxPoints };
      }
    }

    case 'CODING': {
      const isCorrect = trimmedAnswer === trimmedCorrect;
      return { isCorrect, earnedPoints: isCorrect ? maxPoints : 0, maxPoints };
    }

    default: {
      const isCorrect =
        trimmedAnswer.toLowerCase() === trimmedCorrect.toLowerCase();
      return { isCorrect, earnedPoints: isCorrect ? maxPoints : 0, maxPoints };
    }
  }
}

export async function POST(
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

    const body = (await request.json()) as {
      answers?: AnswerInput[];
      timeSpent?: number;
    };
    const { answers, timeSpent } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Format jawaban tidak valid' },
        { status: 400 }
      );
    }

    const examSession = await prisma.examSession.findUnique({
      where: { id: sessionId },
      include: {
        classroom: {
          include: { students: { select: { studentId: true } } },
        },
        quiz: {
          include: { questions: { orderBy: { order: 'asc' } } },
        },
      },
    });

    if (!examSession) {
      return NextResponse.json(
        { error: 'Sesi ujian tidak ditemukan' },
        { status: 404 }
      );
    }

    if (examSession.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Sesi ujian tidak aktif' },
        { status: 400 }
      );
    }

    const isStudentInClass = examSession.classroom.students.some(
      (s) => s.studentId === userId
    );
    if (!isStudentInClass) {
      return NextResponse.json(
        { error: 'Anda tidak terdaftar di kelas ini' },
        { status: 403 }
      );
    }

    const existingAttempt = await prisma.quizAttempt.findFirst({
      where: {
        userId,
        quizId: examSession.quizId,
        createdAt: { gte: examSession.startedAt ?? examSession.createdAt },
      },
    });

    if (existingAttempt) {
      return NextResponse.json(
        { error: 'Anda sudah mengerjakan ujian ini' },
        { status: 400 }
      );
    }

    const questions = examSession.quiz.questions;
    const questionMap = new Map(questions.map((q) => [q.id, q]));

    let totalScore = 0;
    let maxScore = 0;
    const gradedAnswers: GradedAnswer[] = [];

    for (const ans of answers) {
      const question = questionMap.get(ans.questionId);
      if (!question) continue;

      const result = checkAnswer(
        question.questionType,
        ans.answer,
        question.correctAnswer,
        question.options,
        question.points
      );

      totalScore += result.earnedPoints;
      maxScore += result.maxPoints;

      gradedAnswers.push({
        questionId: ans.questionId,
        isCorrect: result.isCorrect,
        points: result.earnedPoints,
        maxPoints: result.maxPoints,
        correctAnswer: question.correctAnswer,
        userAnswer: ans.answer,
      });
    }

    // Include unanswered questions in maxScore
    for (const q of questions) {
      if (!answers.some((a) => a.questionId === q.id)) {
        maxScore += q.points;
      }
    }

    const percentage =
      maxScore > 0
        ? Math.round((totalScore / maxScore) * 100 * 100) / 100
        : 0;

    const status = percentage >= 60 ? 'COMPLETED' : 'FAILED';

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: examSession.quizId,
        answers: JSON.stringify(gradedAnswers),
        totalScore,
        maxScore,
        percentage,
        timeSpent: timeSpent ?? null,
        status,
      },
    });

    return NextResponse.json({
      attemptId: attempt.id,
      totalScore,
      maxScore,
      percentage,
      status,
      answers: gradedAnswers,
    });
  } catch (error) {
    console.error('Exam submit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
