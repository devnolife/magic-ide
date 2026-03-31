import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        isActivated: true,
        createdAt: true,
        updatedAt: true,
        lastLoginDate: true,
        currentStreak: true,
        longestStreak: true,
        progress: {
          include: {
            chapter: { select: { id: true, title: true, number: true } },
            lessonProgress: {
              include: {
                lesson: {
                  select: { id: true, title: true },
                },
              },
            },
          },
        },
        challenges: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: {
            challenge: {
              select: {
                title: true,
                chapter: { select: { title: true } },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User tidak ditemukan' },
        { status: 404 }
      );
    }

    const chapterProgress = user.progress.map((p) => ({
      chapterId: p.chapter.id,
      chapterTitle: p.chapter.title,
      chapterNumber: p.chapter.number,
      completedLessons: p.completedLessons,
      totalLessons: p.totalLessons,
      completedChallenges: p.completedChallenges,
      totalChallenges: p.totalChallenges,
      totalPoints: p.totalPoints,
      lastAccessedAt: p.lastAccessedAt,
    }));

    const recentChallenges = user.challenges.map((a) => ({
      id: a.id,
      challengeTitle: a.challenge.title,
      chapterTitle: a.challenge.chapter.title,
      score: a.score,
      status: a.status,
      timeSpent: a.timeSpent,
      createdAt: a.createdAt,
    }));

    const lessonProgress = user.progress.flatMap((p) =>
      p.lessonProgress.map((lp) => ({
        lessonId: lp.lesson.id,
        lessonTitle: lp.lesson.title,
        chapterTitle: p.chapter.title,
        status: lp.status,
        timeSpent: lp.timeSpent,
        completedAt: lp.completedAt,
      }))
    );

    const totalTimeSpent = user.progress.reduce((sum, p) => sum + p.timeSpent, 0);
    const totalPoints = user.progress.reduce((sum, p) => sum + p.totalPoints, 0);
    const totalCompletedLessons = user.progress.reduce((sum, p) => sum + p.completedLessons, 0);
    const totalLessons = user.progress.reduce((sum, p) => sum + p.totalLessons, 0);
    const totalCompletedChallenges = user.progress.reduce((sum, p) => sum + p.completedChallenges, 0);
    const completionRate = totalLessons > 0
      ? Math.round((totalCompletedLessons / totalLessons) * 100)
      : 0;

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        isActivated: user.isActivated,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginDate: user.lastLoginDate,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        chapterProgress,
        recentChallenges,
        lessonProgress,
        stats: {
          totalTimeSpent,
          totalPoints,
          completionRate,
          totalCompletedLessons,
          totalCompletedChallenges,
        },
      },
    });
  } catch (error) {
    console.error('Admin user detail error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data user' },
      { status: 500 }
    );
  }
}
