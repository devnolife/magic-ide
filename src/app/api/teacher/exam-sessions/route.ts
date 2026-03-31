import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

async function authenticateTeacher(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) {
    return { error: NextResponse.json({ error: 'No token provided' }, { status: 401 }) };
  }
  const session = await validateSession(token);
  if (!session) {
    return { error: NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 }) };
  }
  if (!['TEACHER', 'ADMIN'].includes(session.user.role)) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 403 }) };
  }
  return { userId: session.user.id };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateTeacher(request);
    if ('error' in auth) return auth.error;
    const { userId } = auth;

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    const whereClause: Record<string, unknown> = {
      classroom: { teacherId: userId },
    };
    if (statusFilter && ['SCHEDULED', 'ACTIVE', 'CLOSED'].includes(statusFilter)) {
      whereClause.status = statusFilter;
    }

    const sessions = await prisma.examSession.findMany({
      where: whereClause,
      include: {
        classroom: { select: { id: true, name: true } },
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
            timeLimit: true,
            chapter: { select: { number: true, title: true } },
            _count: { select: { questions: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const sessionsWithCounts = await Promise.all(
      sessions.map(async (s) => {
        const studentIds = await prisma.classroomStudent.findMany({
          where: { classroomId: s.classroomId },
          select: { studentId: true },
        });
        const ids = studentIds.map((st) => st.studentId);
        const attemptCount = await prisma.quizAttempt.count({
          where: {
            quizId: s.quizId,
            userId: { in: ids },
          },
        });

        const totalStudents = ids.length;
        let averageScore: number | null = null;

        if (attemptCount > 0) {
          const attempts = await prisma.quizAttempt.aggregate({
            where: {
              quizId: s.quizId,
              userId: { in: ids },
            },
            _avg: { percentage: true },
          });
          averageScore = attempts._avg.percentage ?? null;
        }

        return { ...s, attemptCount, totalStudents, averageScore };
      })
    );

    return NextResponse.json({ sessions: sessionsWithCounts });
  } catch (error) {
    console.error('Error fetching exam sessions:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data sesi ujian' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateTeacher(request);
    if ('error' in auth) return auth.error;
    const { userId } = auth;

    const body = await request.json();
    const { classroomId, quizId, duration } = body;

    if (!classroomId || !quizId) {
      return NextResponse.json(
        { error: 'classroomId dan quizId wajib diisi' },
        { status: 400 }
      );
    }

    const classroom = await prisma.classroom.findFirst({
      where: { id: classroomId, teacherId: userId },
    });
    if (!classroom) {
      return NextResponse.json(
        { error: 'Kelas tidak ditemukan atau bukan milik Anda' },
        { status: 404 }
      );
    }

    const quiz = await prisma.quiz.findFirst({
      where: { id: quizId, isActive: true },
    });
    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz tidak ditemukan atau tidak aktif' },
        { status: 404 }
      );
    }

    const existingSession = await prisma.examSession.findFirst({
      where: {
        classroomId,
        quizId,
        status: { in: ['SCHEDULED', 'ACTIVE'] },
      },
    });
    if (existingSession) {
      return NextResponse.json(
        { error: 'Sudah ada sesi ujian aktif atau terjadwal untuk kelas dan quiz ini' },
        { status: 409 }
      );
    }

    const session = await prisma.examSession.create({
      data: {
        classroomId,
        quizId,
        status: 'SCHEDULED',
        ...(duration != null ? { duration } : {}),
      },
      include: {
        classroom: { select: { id: true, name: true } },
        quiz: {
          select: {
            id: true,
            title: true,
            description: true,
            timeLimit: true,
            chapter: { select: { number: true, title: true } },
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Sesi ujian berhasil dibuat', session },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating exam session:', error);
    return NextResponse.json(
      { error: 'Gagal membuat sesi ujian' },
      { status: 500 }
    );
  }
}
