import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 401 });
    }

    const session = await validateSession(token);
    if (!session) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const enrollments = await prisma.classroomStudent.findMany({
      where: { studentId: session.user.id },
      include: {
        classroom: {
          include: {
            teacher: {
              select: { id: true, name: true, username: true },
            },
            _count: { select: { students: true } },
          },
        },
      },
    });

    const classrooms = enrollments.map((e) => ({
      id: e.classroom.id,
      name: e.classroom.name,
      description: e.classroom.description,
      teacherName: e.classroom.teacher.name ?? e.classroom.teacher.username,
      studentCount: e.classroom._count.students,
      joinedAt: e.joinedAt,
    }));

    return NextResponse.json({ classrooms });
  } catch (error) {
    console.error('Error fetching student classrooms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
