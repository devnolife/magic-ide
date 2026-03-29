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
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const { role, id: userId } = session.user;

    if (role !== 'TEACHER' && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Teacher or admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    const where: Record<string, unknown> = {};

    // TEACHER sees only own classrooms, ADMIN sees all
    if (role === 'TEACHER') {
      where.teacherId = userId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ];
    }

    const classrooms = await prisma.classroom.findMany({
      where,
      include: {
        teacher: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ classrooms });

  } catch (error) {
    console.error('Classrooms fetch error:', error);
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
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const { role, id: userId } = session.user;

    if (role !== 'TEACHER' && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Teacher or admin access required' },
        { status: 403 }
      );
    }

    const { name, description, teacherId } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: 'Classroom name is required' },
        { status: 400 }
      );
    }

    // ADMIN can specify a teacherId, otherwise use the session user
    const assignedTeacherId = role === 'ADMIN' && teacherId ? teacherId : userId;

    // Verify the assigned teacher exists and has TEACHER role
    if (assignedTeacherId !== userId) {
      const teacher = await prisma.user.findUnique({
        where: { id: assignedTeacherId },
        select: { role: true },
      });

      if (!teacher || teacher.role !== 'TEACHER') {
        return NextResponse.json(
          { error: 'Specified teacher not found or does not have TEACHER role' },
          { status: 400 }
        );
      }
    }

    const classroom = await prisma.classroom.create({
      data: {
        name,
        description: description || null,
        teacherId: assignedTeacherId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    return NextResponse.json(
      { message: 'Classroom created successfully', classroom },
      { status: 201 }
    );

  } catch (error) {
    console.error('Classroom create error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
