import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';
import { logAction } from '@/lib/auditLog';

export async function DELETE(
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

    const { id: targetUserId } = await params;

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, username: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse optional chapterId from request body
    let chapterId: string | undefined;
    try {
      const body = await request.json();
      chapterId = body.chapterId;
    } catch {
      // No body or invalid JSON — reset all progress
    }

    if (chapterId) {
      // Reset progress for a specific chapter
      const userProgress = await prisma.userProgress.findUnique({
        where: {
          userId_chapterId: { userId: targetUserId, chapterId },
        },
      });

      if (!userProgress) {
        return NextResponse.json(
          { error: 'No progress found for this chapter' },
          { status: 404 }
        );
      }

      // Find challenges belonging to this chapter
      const challengeIds = await prisma.challenge.findMany({
        where: { chapterId },
        select: { id: true },
      });

      await prisma.$transaction([
        prisma.lessonProgress.deleteMany({
          where: { userProgressId: userProgress.id },
        }),
        prisma.challengeAttempt.deleteMany({
          where: {
            userId: targetUserId,
            challengeId: { in: challengeIds.map((c) => c.id) },
          },
        }),
        prisma.userProgress.delete({
          where: { id: userProgress.id },
        }),
      ]);

      const chapter = await prisma.chapter.findUnique({
        where: { id: chapterId },
        select: { number: true },
      });

      await logAction(session.user.id, 'PROGRESS_RESET', targetUser.username, {
        targetUserId,
        chapterId,
        chapterNumber: chapter?.number,
      });

      return NextResponse.json({
        success: true,
        message: `Progress chapter ${chapter?.number ?? chapterId} untuk user ${targetUser.username} direset`,
      });
    }

    // Reset ALL progress for the user
    await prisma.$transaction([
      prisma.lessonProgress.deleteMany({
        where: { userId: targetUserId },
      }),
      prisma.challengeAttempt.deleteMany({
        where: { userId: targetUserId },
      }),
      prisma.userProgress.deleteMany({
        where: { userId: targetUserId },
      }),
    ]);

    await logAction(session.user.id, 'PROGRESS_RESET', targetUser.username, {
      targetUserId,
      scope: 'all',
    });

    return NextResponse.json({
      success: true,
      message: `Semua progress untuk user ${targetUser.username} direset`,
    });
  } catch (error) {
    console.error('Admin progress reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
