import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ number: string }> }
) {
  try {
    const { number } = await params;
    const chapterNumber = parseInt(number);

    if (isNaN(chapterNumber)) {
      return NextResponse.json(
        { error: 'Invalid chapter number' },
        { status: 400 }
      );
    }

    const chapter = await prisma.chapter.findUnique({
      where: { number: chapterNumber },
      include: {
        lessons: {
          select: { id: true, number: true, title: true },
          orderBy: { number: 'asc' },
        },
        challenges: {
          select: { id: true, number: true, title: true, difficulty: true, points: true },
          orderBy: { number: 'asc' },
        },
      },
    });

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      chapterId: chapter.id,
      chapterNumber: chapter.number,
      title: chapter.title,
      lessons: chapter.lessons,
      challenges: chapter.challenges,
    });
  } catch (error) {
    console.error('Chapter lessons fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
