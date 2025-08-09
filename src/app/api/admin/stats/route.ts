import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
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
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get basic statistics
    const [
      totalUsers,
      activeUsers,
      totalSessions,
      totalChallengeAttempts,
      completedChallenges,
      totalTimeSpent,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.userSession.count(),
      prisma.challengeAttempt.count(),
      prisma.challengeAttempt.count({ where: { status: 'COMPLETED' } }),
      prisma.userProgress.aggregate({
        _sum: {
          timeSpent: true,
        },
      }),
    ]);

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRegistrations = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Get user progress distribution by chapter
    const chapterProgress = await prisma.userProgress.groupBy({
      by: ['chapterId'],
      _count: {
        userId: true,
      },
      _avg: {
        completedLessons: true,
        completedChallenges: true,
        totalPoints: true,
      },
    });

    // Get top performers
    const topPerformers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        progress: {
          select: {
            totalPoints: true,
            completedLessons: true,
            completedChallenges: true,
          },
        },
      },
      orderBy: {
        progress: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // Calculate total points for each user
    const topPerformersWithTotalPoints = topPerformers.map(user => {
      const totalPoints = user.progress.reduce((sum, p) => sum + p.totalPoints, 0);
      const totalCompletedLessons = user.progress.reduce((sum, p) => sum + p.completedLessons, 0);
      const totalCompletedChallenges = user.progress.reduce((sum, p) => sum + p.completedChallenges, 0);
      
      return {
        ...user,
        totalPoints,
        totalCompletedLessons,
        totalCompletedChallenges,
        progress: undefined,
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);

    // Get daily active users for the last 7 days
    const dailyActiveUsers = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const count = await prisma.userProgress.count({
          where: {
            lastAccessedAt: {
              gte: date,
              lt: nextDate,
            },
          },
        });

        return {
          date: date.toISOString().split('T')[0],
          activeUsers: count,
        };
      })
    );

    return NextResponse.json({
      overview: {
        totalUsers,
        activeUsers,
        recentRegistrations,
        totalSessions,
        totalChallengeAttempts,
        completedChallenges,
        totalTimeSpent: totalTimeSpent._sum.timeSpent || 0,
        challengeCompletionRate: totalChallengeAttempts > 0 
          ? Math.round((completedChallenges / totalChallengeAttempts) * 100)
          : 0,
      },
      chapterProgress,
      topPerformers: topPerformersWithTotalPoints,
      dailyActiveUsers: dailyActiveUsers.reverse(),
    });

  } catch (error) {
    console.error('Admin stats fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}