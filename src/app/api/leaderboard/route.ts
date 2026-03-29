import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const classroomId = searchParams.get('classroomId');
    const period = searchParams.get('period') || 'all'; // all | weekly | monthly

    let dateFilter: Date | undefined;
    if (period === 'weekly') {
      dateFilter = new Date();
      dateFilter.setDate(dateFilter.getDate() - 7);
    } else if (period === 'monthly') {
      dateFilter = new Date();
      dateFilter.setMonth(dateFilter.getMonth() - 1);
    }

    // If classroomId is provided, only show students in that classroom
    let studentIds: string[] | undefined;
    if (classroomId) {
      const classroomStudents = await prisma.classroomStudent.findMany({
        where: { classroomId },
        select: { studentId: true },
      });
      studentIds = classroomStudents.map((cs) => cs.studentId);
    }

    // Get all users with their progress
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        ...(studentIds ? { id: { in: studentIds } } : { role: 'USER' }),
      },
      select: {
        id: true,
        username: true,
        name: true,
        progress: {
          select: {
            totalPoints: true,
            completedLessons: true,
            completedChallenges: true,
            timeSpent: true,
            lastAccessedAt: true,
          },
          ...(dateFilter
            ? { where: { lastAccessedAt: { gte: dateFilter } } }
            : {}),
        },
      },
    });

    // Aggregate and rank
    const leaderboard = users
      .map((user) => {
        const totalPoints = user.progress.reduce((s, p) => s + p.totalPoints, 0);
        const completedLessons = user.progress.reduce((s, p) => s + p.completedLessons, 0);
        const completedChallenges = user.progress.reduce((s, p) => s + p.completedChallenges, 0);
        const timeSpent = user.progress.reduce((s, p) => s + p.timeSpent, 0);

        return {
          id: user.id,
          username: user.username,
          name: user.name,
          totalPoints,
          completedLessons,
          completedChallenges,
          timeSpent,
        };
      })
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .map((user, index) => ({ ...user, rank: index + 1 }));

    // Find current user's rank
    const myRank = leaderboard.find((u) => u.id === session.user.id);

    // Get classrooms for filter dropdown (if teacher/admin)
    let classrooms: { id: string; name: string }[] = [];
    if (session.user.role === 'TEACHER') {
      classrooms = await prisma.classroom.findMany({
        where: { teacherId: session.user.id, isActive: true },
        select: { id: true, name: true },
      });
    } else if (session.user.role === 'ADMIN') {
      classrooms = await prisma.classroom.findMany({
        where: { isActive: true },
        select: { id: true, name: true },
      });
    }

    return NextResponse.json({
      leaderboard: leaderboard.slice(0, 50),
      myRank: myRank || null,
      totalParticipants: leaderboard.length,
      classrooms,
      period,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
