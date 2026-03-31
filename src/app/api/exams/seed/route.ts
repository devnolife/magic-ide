import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';
import { examQuestions } from '@/data/examQuestions';

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
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    if (!['TEACHER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    let seeded = 0;

    for (const exam of examQuestions) {
      const chapter = await prisma.chapter.findUnique({
        where: { number: exam.chapterNumber },
      });

      if (!chapter) continue;

      await prisma.$transaction(async (tx) => {
        const existingQuiz = await tx.quiz.findFirst({
          where: { chapterId: chapter.id, title: exam.title },
        });

        const quiz = existingQuiz
          ? await tx.quiz.update({
              where: { id: existingQuiz.id },
              data: {
                description: exam.description,
                timeLimit: exam.timeLimit,
                isActive: true,
              },
            })
          : await tx.quiz.create({
              data: {
                chapterId: chapter.id,
                title: exam.title,
                description: exam.description,
                timeLimit: exam.timeLimit,
                isActive: true,
              },
            });

        await tx.question.deleteMany({
          where: { quizId: quiz.id },
        });

        await tx.question.createMany({
          data: exam.questions.map((q, index) => {
            let options: string | null = null;
            if (q.questionType === 'MULTIPLE_CHOICE' && q.options) {
              options = JSON.stringify(q.options);
            } else if (q.questionType === 'ESSAY' && q.keywords) {
              options = JSON.stringify({ keywords: q.keywords });
            } else if (q.questionType === 'MATCHING' && q.matchingPairs) {
              options = JSON.stringify({ pairs: q.matchingPairs });
            }

            return {
              quizId: quiz.id,
              questionText: q.questionText,
              questionType: q.questionType,
              points: q.points,
              order: index + 1,
              options,
              correctAnswer: q.correctAnswer,
            };
          }),
        });

        seeded++;
      });
    }

    return NextResponse.json({
      message: 'Soal ujian berhasil disinkronkan',
      seeded,
    });
  } catch (error) {
    console.error('Exam seed error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
