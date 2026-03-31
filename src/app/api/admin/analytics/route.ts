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

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      chapters,
      allProgress,
      challengeAttempts,
      challenges,
      dailyActivity,
    ] = await Promise.all([
      // All chapters for reference
      prisma.chapter.findMany({
        select: { id: true, number: true, title: true },
        orderBy: { number: 'asc' },
      }),

      // All user progress records
      prisma.userProgress.findMany({
        select: {
          userId: true,
          chapterId: true,
          completedLessons: true,
          totalLessons: true,
          completedChallenges: true,
          totalChallenges: true,
          timeSpent: true,
        },
      }),

      // All challenge attempts with challenge info
      prisma.challengeAttempt.findMany({
        select: {
          challengeId: true,
          score: true,
          status: true,
        },
        where: {
          challenge: { isActive: true },
        },
      }),

      // All active challenges for reference
      prisma.challenge.findMany({
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          chapterId: true,
          points: true,
          difficulty: true,
        },
      }),

      // Daily active users for last 30 days
      Promise.all(
        Array.from({ length: 30 }, async (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          date.setHours(0, 0, 0, 0);

          const nextDate = new Date(date);
          nextDate.setDate(nextDate.getDate() + 1);

          const count = await prisma.userProgress.groupBy({
            by: ['userId'],
            where: {
              lastAccessedAt: {
                gte: date,
                lt: nextDate,
              },
            },
          });

          return {
            date: date.toISOString().split('T')[0],
            count: count.length,
          };
        })
      ),
    ]);

    // 1. Completion funnel per chapter
    const completionFunnel = chapters.map((chapter) => {
      const chapterProgress = allProgress.filter(
        (p) => p.chapterId === chapter.id
      );
      const started = chapterProgress.length;
      const completed = chapterProgress.filter(
        (p) => p.totalLessons > 0 && p.completedLessons >= p.totalLessons
      ).length;

      return {
        chapterId: chapter.id,
        chapterNumber: chapter.number,
        chapterTitle: chapter.title,
        started,
        completed,
      };
    });

    // 2. Challenge difficulty stats
    const challengeMap = new Map(
      challenges.map((c) => [c.id, c])
    );

    const challengeStatsMap = new Map<
      string,
      { scores: number[]; attempts: number }
    >();

    for (const attempt of challengeAttempts) {
      const existing = challengeStatsMap.get(attempt.challengeId);
      if (existing) {
        existing.scores.push(attempt.score);
        existing.attempts++;
      } else {
        challengeStatsMap.set(attempt.challengeId, {
          scores: [attempt.score],
          attempts: 1,
        });
      }
    }

    const challengeDifficulty = challenges.map((challenge) => {
      const stats = challengeStatsMap.get(challenge.id);
      const avgScore = stats
        ? Math.round(
            stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length
          )
        : 0;

      return {
        challengeId: challenge.id,
        title: challenge.title,
        difficulty: challenge.difficulty,
        points: challenge.points,
        avgScore,
        attempts: stats?.attempts ?? 0,
      };
    });

    // 3. Time distribution per chapter (average minutes)
    const timeDistribution = chapters.map((chapter) => {
      const chapterProgress = allProgress.filter(
        (p) => p.chapterId === chapter.id
      );
      const totalTime = chapterProgress.reduce(
        (sum, p) => sum + p.timeSpent,
        0
      );
      const avgTime =
        chapterProgress.length > 0
          ? Math.round(totalTime / chapterProgress.length)
          : 0;

      return {
        chapterId: chapter.id,
        chapterNumber: chapter.number,
        chapterTitle: chapter.title,
        avgMinutes: avgTime,
        totalStudents: chapterProgress.length,
      };
    });

    // 4. Activity trends (last 30 days, reversed to chronological)
    const activityTrends = dailyActivity.reverse();

    // 5. Progress distribution
    // Compute per-user overall completion rate
    const userProgressMap = new Map<
      string,
      { completedLessons: number; totalLessons: number }
    >();

    for (const p of allProgress) {
      const existing = userProgressMap.get(p.userId);
      if (existing) {
        existing.completedLessons += p.completedLessons;
        existing.totalLessons += p.totalLessons;
      } else {
        userProgressMap.set(p.userId, {
          completedLessons: p.completedLessons,
          totalLessons: p.totalLessons,
        });
      }
    }

    const distribution = { low: 0, medium: 0, high: 0, complete: 0 };
    for (const [, data] of userProgressMap) {
      const rate =
        data.totalLessons > 0
          ? (data.completedLessons / data.totalLessons) * 100
          : 0;
      if (rate <= 25) distribution.low++;
      else if (rate <= 50) distribution.medium++;
      else if (rate <= 75) distribution.high++;
      else distribution.complete++;
    }

    const totalStudents =
      distribution.low +
      distribution.medium +
      distribution.high +
      distribution.complete;

    const progressDistribution = {
      ranges: [
        { label: '0-25%', count: distribution.low },
        { label: '25-50%', count: distribution.medium },
        { label: '50-75%', count: distribution.high },
        { label: '75-100%', count: distribution.complete },
      ],
      totalStudents,
    };

    return NextResponse.json({
      completionFunnel,
      challengeDifficulty,
      timeDistribution,
      activityTrends,
      progressDistribution,
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
