import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

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
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { role, id: userId } = session.user;

    const classroom = await prisma.classroom.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
          },
        },
        students: {
          include: {
            student: {
              select: {
                id: true,
                username: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            joinedAt: 'asc',
          },
        },
      },
    });

    if (!classroom) {
      return NextResponse.json(
        { error: 'Classroom not found' },
        { status: 404 }
      );
    }

    // Only owning teacher or ADMIN can view
    if (role !== 'ADMIN' && classroom.teacherId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json({ classroom });

  } catch (error) {
    console.error('Classroom fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { role, id: userId } = session.user;

    const classroom = await prisma.classroom.findUnique({
      where: { id },
      select: { teacherId: true },
    });

    if (!classroom) {
      return NextResponse.json(
        { error: 'Classroom not found' },
        { status: 404 }
      );
    }

    if (role !== 'ADMIN' && classroom.teacherId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    const { name, description, isActive } = await request.json();

    const updatedClassroom = await prisma.classroom.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        description: description !== undefined ? description : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
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

    return NextResponse.json({
      message: 'Classroom updated successfully',
      classroom: updatedClassroom,
    });

  } catch (error) {
    console.error('Classroom update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { role, id: userId } = session.user;

    const classroom = await prisma.classroom.findUnique({
      where: { id },
      select: { teacherId: true },
    });

    if (!classroom) {
      return NextResponse.json(
        { error: 'Classroom not found' },
        { status: 404 }
      );
    }

    if (role !== 'ADMIN' && classroom.teacherId !== userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    await prisma.classroom.delete({ where: { id } });

    return NextResponse.json({
      message: 'Classroom deleted successfully',
    });

  } catch (error) {
    console.error('Classroom delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
