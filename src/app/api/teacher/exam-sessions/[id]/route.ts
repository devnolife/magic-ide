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

async function findSessionForTeacher(id: string, userId: string) {
  return prisma.examSession.findFirst({
    where: {
      id,
      classroom: { teacherId: userId },
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateTeacher(request);
    if ('error' in auth) return auth.error;
    const { userId } = auth;
    const { id } = await params;

    const session = await prisma.examSession.findFirst({
      where: {
        id,
        classroom: { teacherId: userId },
      },
      include: {
        classroom: {
          select: {
            id: true,
            name: true,
            students: {
              select: {
                student: {
                  select: { id: true, username: true, name: true },
                },
                joinedAt: true,
              },
            },
          },
        },
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
    });

    if (!session) {
      return NextResponse.json(
        { error: 'Sesi ujian tidak ditemukan' },
        { status: 404 }
      );
    }

    const studentIds = session.classroom.students.map((s) => s.student.id);
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        quizId: session.quizId,
        userId: { in: studentIds },
      },
      select: {
        id: true,
        totalScore: true,
        maxScore: true,
        percentage: true,
        timeSpent: true,
        status: true,
        createdAt: true,
        user: { select: { id: true, username: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      session: { ...session, attempts },
    });
  } catch (error) {
    console.error('Error fetching exam session:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data sesi ujian' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateTeacher(request);
    if ('error' in auth) return auth.error;
    const { userId } = auth;
    const { id } = await params;

    const existingSession = await findSessionForTeacher(id, userId);
    if (!existingSession) {
      return NextResponse.json(
        { error: 'Sesi ujian tidak ditemukan' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !['ACTIVE', 'CLOSED'].includes(status)) {
      return NextResponse.json(
        { error: "Status harus 'ACTIVE' atau 'CLOSED'" },
        { status: 400 }
      );
    }

    if (existingSession.status === 'CLOSED') {
      return NextResponse.json(
        { error: 'Sesi ujian yang sudah ditutup tidak dapat diubah' },
        { status: 400 }
      );
    }

    if (existingSession.status === 'SCHEDULED' && status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Sesi terjadwal hanya dapat diubah ke ACTIVE' },
        { status: 400 }
      );
    }

    if (existingSession.status === 'ACTIVE' && status !== 'CLOSED') {
      return NextResponse.json(
        { error: 'Sesi aktif hanya dapat diubah ke CLOSED' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { status };
    if (status === 'ACTIVE') {
      updateData.startedAt = new Date();
    } else if (status === 'CLOSED') {
      updateData.closedAt = new Date();
    }

    const session = await prisma.examSession.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({
      message: 'Status sesi ujian diperbarui',
      session,
    });
  } catch (error) {
    console.error('Error updating exam session:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui sesi ujian' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authenticateTeacher(request);
    if ('error' in auth) return auth.error;
    const { userId } = auth;
    const { id } = await params;

    const existingSession = await findSessionForTeacher(id, userId);
    if (!existingSession) {
      return NextResponse.json(
        { error: 'Sesi ujian tidak ditemukan' },
        { status: 404 }
      );
    }

    if (existingSession.status !== 'SCHEDULED') {
      return NextResponse.json(
        { error: 'Hanya sesi ujian dengan status SCHEDULED yang dapat dihapus' },
        { status: 400 }
      );
    }

    await prisma.examSession.delete({ where: { id } });

    return NextResponse.json({ message: 'Sesi ujian berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting exam session:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus sesi ujian' },
      { status: 500 }
    );
  }
}
