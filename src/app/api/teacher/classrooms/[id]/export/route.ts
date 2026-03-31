import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

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

    if (!['TEACHER', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
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
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const classroomStudents = await prisma.classroomStudent.findMany({
      where: { classroomId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { joinedAt: 'asc' },
    });

    const studentIds = classroomStudents.map((cs) => cs.student.id);

    // Empty classroom — return CSV with headers only
    if (studentIds.length === 0) {
      const headers = ['Nama', 'Username', 'Email'];
      for (let i = 0; i <= 5; i++) headers.push(`Ch${i} Progress (%)`);
      headers.push('Rata-rata Skor Ujian', 'Total Challenges Selesai', 'Terakhir Aktif');

      const csv = headers.map(escapeCsvField).join(',') + '\n';
      const safeName = classroom.name.replace(/[^a-zA-Z0-9_-]/g, '_');
      const dateStr = new Date().toISOString().slice(0, 10);

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="kelas-${safeName}-${dateStr}.csv"`,
        },
      });
    }

    const [allProgress, allQuizAttempts, allChallengeAttempts, lastActiveByStudent] =
      await Promise.all([
        prisma.userProgress.findMany({
          where: { userId: { in: studentIds } },
          include: {
            chapter: { select: { id: true, number: true } },
          },
        }),
        prisma.quizAttempt.findMany({
          where: { userId: { in: studentIds } },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.challengeAttempt.findMany({
          where: {
            userId: { in: studentIds },
            status: 'COMPLETED',
          },
          select: { userId: true, id: true },
        }),
        prisma.userProgress.groupBy({
          by: ['userId'],
          where: { userId: { in: studentIds } },
          _max: { updatedAt: true },
        }),
      ]);

    const lastActiveMap = new Map(
      lastActiveByStudent.map((r) => [r.userId, r._max.updatedAt])
    );

    // Build per-student chapter progress map
    const progressMap = new Map<string, Map<number, number>>();
    for (const p of allProgress) {
      if (!progressMap.has(p.userId)) progressMap.set(p.userId, new Map());
      const total = p.totalLessons || 1;
      const pct = Math.round((p.completedLessons / total) * 100);
      progressMap.get(p.userId)!.set(p.chapter.number, pct);
    }

    // Latest quiz attempt per (user, quiz)
    const latestQuizMap = new Map<string, { totalScore: number; maxScore: number }>();
    for (const qa of allQuizAttempts) {
      const key = `${qa.userId}::${qa.quizId}`;
      if (!latestQuizMap.has(key)) {
        latestQuizMap.set(key, { totalScore: qa.totalScore, maxScore: qa.maxScore });
      }
    }

    // Aggregate quiz averages per user
    const quizAvgMap = new Map<string, number>();
    const userQuizzes = new Map<string, { totalScore: number; maxScore: number }[]>();
    for (const [key, val] of latestQuizMap) {
      const userId = key.split('::')[0];
      if (!userQuizzes.has(userId)) userQuizzes.set(userId, []);
      userQuizzes.get(userId)!.push(val);
    }
    for (const [userId, quizzes] of userQuizzes) {
      if (quizzes.length === 0) continue;
      const totalMax = quizzes.reduce((s, q) => s + q.maxScore, 0);
      const totalScore = quizzes.reduce((s, q) => s + q.totalScore, 0);
      quizAvgMap.set(userId, totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0);
    }

    // Completed challenges count per user
    const challengeCountMap = new Map<string, number>();
    for (const ca of allChallengeAttempts) {
      challengeCountMap.set(ca.userId, (challengeCountMap.get(ca.userId) ?? 0) + 1);
    }

    // Build CSV
    const columnHeaders = ['Nama', 'Username', 'Email'];
    for (let i = 0; i <= 5; i++) columnHeaders.push(`Ch${i} Progress (%)`);
    columnHeaders.push('Rata-rata Skor Ujian', 'Total Challenges Selesai', 'Terakhir Aktif');

    const rows: string[] = [columnHeaders.map(escapeCsvField).join(',')];

    for (const cs of classroomStudents) {
      const student = cs.student;
      const studentChapters = progressMap.get(student.id);
      const quizAvg = quizAvgMap.get(student.id);
      const challengeCount = challengeCountMap.get(student.id) ?? 0;
      const lastActive = lastActiveMap.get(student.id);

      const fields: string[] = [
        escapeCsvField(student.name || student.username),
        escapeCsvField(student.username),
        escapeCsvField(student.email),
      ];

      for (let i = 0; i <= 5; i++) {
        const pct = studentChapters?.get(i) ?? 0;
        fields.push(String(pct));
      }

      fields.push(quizAvg !== undefined ? String(quizAvg) : '0');
      fields.push(String(challengeCount));
      fields.push(
        lastActive
          ? new Date(lastActive).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : '-'
      );

      rows.push(fields.join(','));
    }

    const csv = rows.join('\n') + '\n';
    const safeName = classroom.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const dateStr = new Date().toISOString().slice(0, 10);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="kelas-${safeName}-${dateStr}.csv"`,
      },
    });
  } catch (error) {
    console.error('CSV export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
