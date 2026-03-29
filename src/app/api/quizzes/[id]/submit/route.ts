import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

interface SubmittedAnswer {
  questionId: string;
  answer: string;
}

export async function POST(
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

    const userId = session.user.id;
    const { id: quizId } = await params;
    const body = await request.json();
    const { answers, timeSpent } = body as {
      answers: SubmittedAnswer[];
      timeSpent?: number;
    };

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'answers must be an array of {questionId, answer}' },
        { status: 400 }
      );
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: true,
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

    // Build a map of questions for fast lookup
    const questionMap = new Map(
      quiz.questions.map((q) => [q.id, q])
    );

    let totalScore = 0;
    const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);

    const gradedAnswers = answers.map((submitted) => {
      const question = questionMap.get(submitted.questionId);
      if (!question) {
        return {
          questionId: submitted.questionId,
          isCorrect: false,
          points: 0,
          correctAnswer: null,
        };
      }

      const isCorrect = checkAnswer(
        question.questionType,
        submitted.answer,
        question.correctAnswer,
        question.options
      );

      const earnedPoints = isCorrect ? question.points : 0;
      totalScore += earnedPoints;

      return {
        questionId: submitted.questionId,
        isCorrect,
        points: earnedPoints,
        correctAnswer: question.correctAnswer,
      };
    });

    const percentage = maxScore > 0
      ? Math.round((totalScore / maxScore) * 100 * 100) / 100
      : 0;

    const status = percentage >= 60 ? 'COMPLETED' : 'FAILED';

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        answers: JSON.stringify(
          answers.map((a, i) => ({
            questionId: a.questionId,
            answer: a.answer,
            isCorrect: gradedAnswers[i].isCorrect,
            points: gradedAnswers[i].points,
          }))
        ),
        totalScore,
        maxScore,
        percentage,
        timeSpent: timeSpent ?? null,
        status: status as 'COMPLETED' | 'FAILED',
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
    console.error('Quiz submit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function checkAnswer(
  questionType: string,
  userAnswer: string,
  correctAnswer: string | null,
  options: string | null
): boolean {
  if (!correctAnswer && !options) return false;
  if (!userAnswer) return false;

  switch (questionType) {
    case 'MULTIPLE_CHOICE': {
      // correctAnswer stores the label of the correct option (e.g. "A", "B")
      // Also check against options JSON for isCorrect flag
      if (correctAnswer) {
        if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
          return true;
        }
      }
      if (options) {
        try {
          const parsed = JSON.parse(options);
          if (Array.isArray(parsed)) {
            const correct = parsed.find(
              (o: { label?: string; isCorrect?: boolean }) => o.isCorrect
            );
            if (correct?.label) {
              return userAnswer.trim().toLowerCase() === correct.label.trim().toLowerCase();
            }
          }
        } catch {
          // options is not valid JSON, fall through
        }
      }
      return false;
    }

    case 'TRUE_FALSE': {
      if (!correctAnswer) return false;
      return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    }

    case 'SHORT_ANSWER': {
      if (!correctAnswer) return false;
      return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    }

    case 'CODING': {
      if (!correctAnswer) return false;
      return userAnswer.trim() === correctAnswer.trim();
    }

    default:
      return false;
  }
}
