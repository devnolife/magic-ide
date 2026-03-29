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

    const chapters = await prisma.chapter.findMany({
      include: {
        _count: {
          select: {
            lessons: true,
            quizzes: true,
          },
        },
      },
      orderBy: { number: 'asc' },
    });

    return NextResponse.json({ chapters });

  } catch (error) {
    console.error('Admin chapters fetch error:', error);
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
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const { number, title, description } = await request.json();

    if (!number || !title) {
      return NextResponse.json(
        { error: 'number and title are required' },
        { status: 400 }
      );
    }

    const existing = await prisma.chapter.findUnique({ where: { number } });
    if (existing) {
      return NextResponse.json(
        { error: 'A chapter with this number already exists' },
        { status: 409 }
      );
    }

    const chapter = await prisma.chapter.create({
      data: {
        number,
        title,
        description: description || null,
      },
    });

    return NextResponse.json(
      { message: 'Chapter created successfully', chapter },
      { status: 201 }
    );

  } catch (error) {
    console.error('Admin chapter create error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
