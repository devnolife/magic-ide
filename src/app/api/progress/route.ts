import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
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

    const { chapterId } = await request.json();

    if (!chapterId) {
      return NextResponse.json(
        { error: 'chapterId is required' },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    const userProgress = await prisma.userProgress.findUnique({
      where: {
        userId_chapterId: { userId, chapterId },
      },
    });

    if (!userProgress) {
      return NextResponse.json(
        { error: 'No progress found for this chapter' },
        { status: 404 }
      );
    }

    // Delete lesson progress linked to this user progress, then the user progress itself
    await prisma.$transaction([
      prisma.lessonProgress.deleteMany({
        where: { userProgressId: userProgress.id },
      }),
      prisma.userProgress.delete({
        where: { id: userProgress.id },
      }),
    ]);

    // Find chapter number for the response message
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: { number: true },
    });

    return NextResponse.json({
      success: true,
      message: `Progress chapter ${chapter?.number ?? chapterId} direset`,
    });
  } catch (error) {
    console.error('Progress reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    // Get ALL chapters with lesson counts
    const chapters = await prisma.chapter.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { lessons: true } },
      },
      orderBy: { number: 'asc' },
    });

    // Get user's progress for chapters they've started
    const userProgress = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        lessonProgress: {
          include: {
            lesson: {
              select: { id: true, number: true, title: true },
            },
          },
        },
      },
    });

    // Build a map of progress by chapterId
    const progressMap = new Map(
      userProgress.map((p) => [p.chapterId, p])
    );

    // Merge: every chapter gets progress data (even if not started)
    const progress = chapters.map((ch) => {
      const up = progressMap.get(ch.id);
      const totalLessons = ch._count.lessons;
      const completedLessons = Math.min(up?.completedLessons ?? 0, totalLessons);

      let status: 'not-started' | 'in-progress' | 'completed' = 'not-started';
      if (completedLessons > 0 && completedLessons >= totalLessons && totalLessons > 0) {
        status = 'completed';
      } else if (completedLessons > 0 || up) {
        status = 'in-progress';
      }

      return {
        chapterId: ch.id,
        chapterNumber: ch.number,
        chapterTitle: ch.title,
        chapterDescription: ch.description,
        totalLessons,
        completedLessons,
        totalPoints: up?.totalPoints ?? 0,
        timeSpent: up?.timeSpent ?? 0,
        status,
        progressPercent: totalLessons > 0 ? Math.min(Math.round((completedLessons / totalLessons) * 100), 100) : 0,
        lessonProgress: up?.lessonProgress ?? [],
      };
    });

    return NextResponse.json({ progress });

  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const { chapterId, lessonId, timeSpent, status } = await request.json();
    const userId = session.user.id;

    // Update or create user progress
    const userProgress = await prisma.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
      update: {
        timeSpent: {
          increment: timeSpent || 0,
        },
        lastAccessedAt: new Date(),
      },
      create: {
        userId,
        chapterId,
        timeSpent: timeSpent || 0,
        lastAccessedAt: new Date(),
      },
    });

    // Update lesson progress if provided
    if (lessonId) {
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId,
          },
        },
        update: {
          status: status || 'IN_PROGRESS',
          timeSpent: {
            increment: timeSpent || 0,
          },
          completedAt: status === 'COMPLETED' ? new Date() : null,
        },
        create: {
          userId,
          lessonId,
          userProgressId: userProgress.id,
          status: status || 'IN_PROGRESS',
          timeSpent: timeSpent || 0,
          completedAt: status === 'COMPLETED' ? new Date() : null,
        },
      });

      // Update chapter progress counts if lesson is completed
      if (status === 'COMPLETED') {
        const completedLessons = await prisma.lessonProgress.count({
          where: {
            userId,
            userProgressId: userProgress.id,
            status: 'COMPLETED',
          },
        });

        await prisma.userProgress.update({
          where: { id: userProgress.id },
          data: {
            completedLessons,
          },
        });
      }
    }

    return NextResponse.json({
      message: 'Progress updated successfully',
    });

  } catch (error) {
    console.error('Progress update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}