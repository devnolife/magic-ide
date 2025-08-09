import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

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

    const { challengeId, code, result, score, status, timeSpent } = await request.json();
    const userId = session.user.id;

    // Create challenge attempt
    const attempt = await prisma.challengeAttempt.create({
      data: {
        userId,
        challengeId,
        code: code || '',
        result: JSON.stringify(result || {}),
        score: score || 0,
        status: status || 'ATTEMPTED',
        timeSpent: timeSpent || 0,
        completedAt: status === 'COMPLETED' ? new Date() : null,
      },
    });

    // If challenge is completed, update user progress
    if (status === 'COMPLETED') {
      const challenge = await prisma.challenge.findUnique({
        where: { id: challengeId },
        select: { chapterId: true, points: true },
      });

      if (challenge) {
        // Update or create user progress for the chapter
        const userProgress = await prisma.userProgress.upsert({
          where: {
            userId_chapterId: {
              userId,
              chapterId: challenge.chapterId,
            },
          },
          update: {
            totalPoints: {
              increment: challenge.points,
            },
            lastAccessedAt: new Date(),
          },
          create: {
            userId,
            chapterId: challenge.chapterId,
            totalPoints: challenge.points,
            lastAccessedAt: new Date(),
          },
        });

        // Count completed challenges for this chapter
        const completedChallenges = await prisma.challengeAttempt.count({
          where: {
            userId,
            challenge: {
              chapterId: challenge.chapterId,
            },
            status: 'COMPLETED',
          },
        });

        await prisma.userProgress.update({
          where: { id: userProgress.id },
          data: {
            completedChallenges,
          },
        });
      }
    }

    return NextResponse.json({
      message: 'Challenge attempt recorded successfully',
      attempt: {
        id: attempt.id,
        score: attempt.score,
        status: attempt.status,
      },
    });

  } catch (error) {
    console.error('Challenge attempt error:', error);
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
    const { searchParams } = new URL(request.url);
    const challengeId = searchParams.get('challengeId');

    if (challengeId) {
      // Get specific challenge attempts
      const attempts = await prisma.challengeAttempt.findMany({
        where: {
          userId,
          challengeId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json({ attempts });
    } else {
      // Get all challenge attempts for user
      const attempts = await prisma.challengeAttempt.findMany({
        where: { userId },
        include: {
          challenge: {
            select: {
              id: true,
              title: true,
              chapterId: true,
              points: true,
              difficulty: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json({ attempts });
    }

  } catch (error) {
    console.error('Challenge fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}