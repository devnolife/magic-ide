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
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const user = session.user;

    const chapters = await prisma.chapter.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { lessons: true, challenges: true } },
      },
      orderBy: { number: 'asc' },
    });

    const userProgress = await prisma.userProgress.findMany({
      where: { userId },
    });

    const challengeAttempts = await prisma.challengeAttempt.findMany({
      where: { userId },
      include: {
        challenge: {
          select: { title: true, chapterId: true, difficulty: true, points: true },
        },
      },
      orderBy: { completedAt: 'desc' },
    });

    const progressMap = new Map(
      userProgress.map((p) => [p.chapterId, p])
    );

    const totalLessonsAll = chapters.reduce((s, ch) => s + ch._count.lessons, 0);
    const completedLessonsAll = userProgress.reduce((s, p) => s + p.completedLessons, 0);
    const overallPercent =
      totalLessonsAll > 0
        ? Math.min(Math.round((completedLessonsAll / totalLessonsAll) * 100), 100)
        : 0;

    const lastActive = userProgress.reduce<Date | null>((latest, p) => {
      if (!latest || p.lastAccessedAt > latest) return p.lastAccessedAt;
      return latest;
    }, null);

    const chaptersExport = chapters.map((ch) => {
      const up = progressMap.get(ch.id);
      return {
        name: `Chapter ${ch.number}: ${ch.title}`,
        progress: ch._count.lessons > 0
          ? Math.min(Math.round(((up?.completedLessons ?? 0) / ch._count.lessons) * 100), 100)
          : 0,
        lessonsCompleted: up?.completedLessons ?? 0,
        totalLessons: ch._count.lessons,
        challengesCompleted: up?.completedChallenges ?? 0,
        totalChallenges: ch._count.challenges,
        timeSpent: up?.timeSpent ?? 0,
        totalPoints: up?.totalPoints ?? 0,
      };
    });

    const attemptsExport = challengeAttempts.map((a) => ({
      challenge: a.challenge.title,
      difficulty: a.challenge.difficulty,
      score: a.score,
      maxPoints: a.challenge.points,
      status: a.status,
      timeSpent: a.timeSpent,
      date: a.completedAt?.toISOString().split('T')[0] ?? '-',
    }));

    return NextResponse.json({
      username: user.username,
      name: user.name,
      overallPercent,
      lastActive: lastActive?.toISOString() ?? null,
      chapters: chaptersExport,
      challengeAttempts: attemptsExport,
    });
  } catch (error) {
    console.error('Progress export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
