import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

export async function POST(
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

    const { id: classroomId } = await params;
    const { role, id: userId } = session.user;

    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
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

    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Verify student exists and has USER role
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true, username: true, name: true, role: true },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    if (student.role !== 'USER') {
      return NextResponse.json(
        { error: 'Only users with USER role can be added as students' },
        { status: 400 }
      );
    }

    // Check if student is already in the classroom
    const existing = await prisma.classroomStudent.findUnique({
      where: {
        classroomId_studentId: {
          classroomId,
          studentId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Student is already in this classroom' },
        { status: 409 }
      );
    }

    const classroomStudent = await prisma.classroomStudent.create({
      data: {
        classroomId,
        studentId,
      },
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
    });

    return NextResponse.json(
      { message: 'Student added to classroom successfully', classroomStudent },
      { status: 201 }
    );

  } catch (error) {
    console.error('Add student error:', error);
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

    const { id: classroomId } = await params;
    const { role, id: userId } = session.user;

    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
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

    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    // Verify the student is in the classroom
    const classroomStudent = await prisma.classroomStudent.findUnique({
      where: {
        classroomId_studentId: {
          classroomId,
          studentId,
        },
      },
    });

    if (!classroomStudent) {
      return NextResponse.json(
        { error: 'Student is not in this classroom' },
        { status: 404 }
      );
    }

    await prisma.classroomStudent.delete({
      where: { id: classroomStudent.id },
    });

    return NextResponse.json({
      message: 'Student removed from classroom successfully',
    });

  } catch (error) {
    console.error('Remove student error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
