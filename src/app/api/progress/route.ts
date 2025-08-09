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

    // Get user's progress across all chapters
    const progress = await prisma.userProgress.findMany({
      where: { userId },
      include: {
        chapter: {
          select: {
            id: true,
            number: true,
            title: true,
            description: true,
          },
        },
        lessonProgress: {
          include: {
            lesson: {
              select: {
                id: true,
                number: true,
                title: true,
                description: true,
              },
            },
          },
        },
      },
      orderBy: {
        chapter: {
          number: 'asc',
        },
      },
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