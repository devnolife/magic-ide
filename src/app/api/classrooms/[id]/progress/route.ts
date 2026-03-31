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

    const { id: classroomId } = await params;

    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
    });

    if (!classroom) {
      return NextResponse.json(
        { error: 'Classroom not found' },
        { status: 404 }
      );
    }

    const isOwner = classroom.teacherId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Only the classroom teacher or an admin can view student progress' },
        { status: 403 }
      );
    }

    // Get all students in the classroom
    const classroomStudents = await prisma.classroomStudent.findMany({
      where: { classroomId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: {
        joinedAt: 'asc',
      },
    });

    const studentIds = classroomStudents.map((cs) => cs.student.id);

    // Fetch progress, quiz attempts, and last activity for all students in parallel
    const [allProgress, allQuizAttempts, lastActiveByStudent] = await Promise.all([
      prisma.userProgress.findMany({
        where: { userId: { in: studentIds } },
        include: {
          chapter: {
            select: {
              id: true,
              number: true,
              title: true,
            },
          },
        },
        orderBy: {
          chapter: {
            number: 'asc',
          },
        },
      }),
      prisma.quizAttempt.findMany({
        where: { userId: { in: studentIds } },
        include: {
          quiz: {
            select: {
              id: true,
              title: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      // Get most recent updatedAt per student from UserProgress
      prisma.userProgress.groupBy({
        by: ['userId'],
        where: { userId: { in: studentIds } },
        _max: { updatedAt: true },
      }),
    ]);

    const lastActiveMap = new Map(
      lastActiveByStudent.map((r) => [r.userId, r._max.updatedAt])
    );

    // Group data by student
    const students = classroomStudents.map((cs) => {
      const studentProgress = allProgress
        .filter((p) => p.userId === cs.student.id)
        .map((p) => ({
          chapterId: p.chapter.id,
          chapterNumber: p.chapter.number,
          chapterTitle: p.chapter.title,
          completedLessons: p.completedLessons,
          totalLessons: p.totalLessons,
          completedChallenges: p.completedChallenges,
          totalChallenges: p.totalChallenges,
          totalPoints: p.totalPoints,
          timeSpent: p.timeSpent,
        }));

      const studentQuizzes = allQuizAttempts
        .filter((qa) => qa.userId === cs.student.id)
        .map((qa) => ({
          quizId: qa.quiz.id,
          quizTitle: qa.quiz.title,
          score: qa.totalScore,
          maxScore: qa.maxScore,
          percentage: qa.percentage,
          timeSpent: qa.timeSpent,
          status: qa.status,
          attemptedAt: qa.createdAt,
        }));

      return {
        id: cs.student.id,
        name: cs.student.name,
        username: cs.student.username,
        joinedAt: cs.joinedAt,
        lastActive: lastActiveMap.get(cs.student.id) ?? null,
        progress: studentProgress,
        quizzes: studentQuizzes,
      };
    });

    return NextResponse.json({
      classroom: {
        id: classroom.id,
        name: classroom.name,
      },
      totalStudents: students.length,
      students,
    });
  } catch (error) {
    console.error('Classroom progress fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
