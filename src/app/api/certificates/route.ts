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

    // Get all chapters with user progress
    const chapters = await prisma.chapter.findMany({
      where: { isActive: true },
      orderBy: { number: 'asc' },
      include: {
        _count: { select: { lessons: true } },
      },
    });

    const userProgress = await prisma.userProgress.findMany({
      where: { userId: session.user.id },
      include: {
        chapter: { select: { id: true, number: true, title: true } },
      },
    });

    const certificates = chapters.map((chapter) => {
      const progress = userProgress.find((p) => p.chapterId === chapter.id);
      const totalLessons = chapter._count.lessons;
      const completedLessons = progress?.completedLessons ?? 0;
      const isCompleted = totalLessons > 0 && completedLessons >= totalLessons;

      return {
        chapterId: chapter.id,
        chapterNumber: chapter.number,
        chapterTitle: chapter.title,
        totalLessons,
        completedLessons,
        isCompleted,
        completedAt: isCompleted ? progress?.updatedAt : null,
        totalPoints: progress?.totalPoints ?? 0,
        timeSpent: progress?.timeSpent ?? 0,
      };
    });

    return NextResponse.json({
      certificates,
      userName: session.user.name || session.user.username,
      totalCompleted: certificates.filter((c) => c.isCompleted).length,
      totalChapters: certificates.length,
    });
  } catch (error) {
    console.error('Certificates error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
