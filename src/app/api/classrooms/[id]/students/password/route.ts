import { NextRequest, NextResponse } from 'next/server';
import { validateSession, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { logAction } from '@/lib/auditLog';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '') || '';
    const session = await validateSession(token);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { role, id: teacherId } = session.user;
    if (role !== 'TEACHER' && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 });
    }

    const { id: classroomId } = await params;
    const { studentId, newPassword } = await request.json();

    if (!studentId || !newPassword || typeof newPassword !== 'string') {
      return NextResponse.json({ error: 'studentId dan newPassword wajib diisi' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 });
    }

    // Verify teacher owns this classroom
    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
      select: { teacherId: true, name: true },
    });

    if (!classroom) {
      return NextResponse.json({ error: 'Kelas tidak ditemukan' }, { status: 404 });
    }

    if (role === 'TEACHER' && classroom.teacherId !== teacherId) {
      return NextResponse.json({ error: 'Anda bukan guru kelas ini' }, { status: 403 });
    }

    // Verify student is in this classroom
    const membership = await prisma.classroomStudent.findUnique({
      where: {
        classroomId_studentId: { classroomId, studentId },
      },
      include: {
        student: { select: { id: true, username: true, name: true } },
      },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Siswa tidak ditemukan di kelas ini' }, { status: 404 });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: studentId },
      data: { password: hashedPassword },
    });

    await logAction(
      teacherId,
      'PASSWORD_RESET',
      membership.student.username,
      { classroom: classroom.name, resetBy: 'teacher' }
    );

    return NextResponse.json({
      success: true,
      message: `Password ${membership.student.name || membership.student.username} berhasil direset`,
    });
  } catch (error) {
    console.error('Teacher password reset error:', error);
    return NextResponse.json({ error: 'Gagal mereset password' }, { status: 500 });
  }
}
