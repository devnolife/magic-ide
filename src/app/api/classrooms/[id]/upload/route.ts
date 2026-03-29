import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSession, hashPassword } from '@/lib/auth';
import * as XLSX from 'xlsx';

interface StudentRow {
  nama?: string;
  username?: string;
  password?: string;
  email?: string;
}

interface StudentResult {
  username: string;
  name: string;
  status: 'created' | 'skipped' | 'error';
  message?: string;
}

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
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { id: classroomId } = await params;

    const classroom = await prisma.classroom.findUnique({
      where: { id: classroomId },
    });

    if (!classroom) {
      return NextResponse.json(
        { error: 'Classroom not found' },
        { status: 404 }
      );
    }

    const isOwner = classroom.teacherId === session.user.id;
    const isAdmin = session.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Only the classroom teacher or an admin can upload students' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      return NextResponse.json(
        { error: 'Invalid file format. Only .xlsx and .xls files are accepted' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let workbook: XLSX.WorkBook;
    try {
      workbook = XLSX.read(buffer, { type: 'buffer' });
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse Excel file. The file may be corrupted' },
        { status: 400 }
      );
    }

    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json(
        { error: 'Excel file contains no sheets' },
        { status: 400 }
      );
    }

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<StudentRow>(sheet, { defval: '' });

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Excel file contains no data rows' },
        { status: 400 }
      );
    }

    // Validate required columns
    const firstRow = rows[0];
    const headers = Object.keys(firstRow).map((h) => h.toLowerCase().trim());
    if (!headers.includes('nama') && !headers.includes('username')) {
      return NextResponse.json(
        { error: 'Excel file must contain at least "nama" and "username" columns' },
        { status: 400 }
      );
    }

    let created = 0;
    let skipped = 0;
    const errors: string[] = [];
    const students: StudentResult[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // Excel row (1-indexed header + 1-indexed data)

      // Normalize keys to lowercase
      const normalized: Record<string, string> = {};
      for (const [key, value] of Object.entries(row)) {
        normalized[key.toLowerCase().trim()] = String(value ?? '').trim();
      }

      const name = normalized['nama'] || '';
      const username = normalized['username'] || '';
      const rawPassword = normalized['password'] || 'password123';
      const email = normalized['email'] || '';

      if (!username) {
        const msg = `Row ${rowNum}: Missing username, skipped`;
        errors.push(msg);
        students.push({ username: '', name, status: 'error', message: msg });
        continue;
      }

      if (!name) {
        const msg = `Row ${rowNum}: Missing nama for username "${username}", skipped`;
        errors.push(msg);
        students.push({ username, name: '', status: 'error', message: msg });
        continue;
      }

      try {
        const existingUser = await prisma.user.findUnique({
          where: { username },
        });

        let userId: string;

        if (existingUser) {
          userId = existingUser.id;

          // Check if already in classroom
          const existingEnrollment = await prisma.classroomStudent.findUnique({
            where: {
              classroomId_studentId: {
                classroomId,
                studentId: userId,
              },
            },
          });

          if (existingEnrollment) {
            skipped++;
            students.push({
              username,
              name,
              status: 'skipped',
              message: 'User already exists and is already in this classroom',
            });
            continue;
          }

          // User exists but not in classroom — add them
          await prisma.classroomStudent.create({
            data: {
              classroomId,
              studentId: userId,
            },
          });

          skipped++;
          students.push({
            username,
            name,
            status: 'skipped',
            message: 'User already exists, added to classroom',
          });
        } else {
          // Create new user
          const hashedPassword = await hashPassword(rawPassword);
          const userEmail = email || `${username}@student.local`;

          const newUser = await prisma.user.create({
            data: {
              username,
              name,
              email: userEmail,
              password: hashedPassword,
              role: 'USER',
              isActive: true,
            },
          });

          userId = newUser.id;

          // Add to classroom
          await prisma.classroomStudent.create({
            data: {
              classroomId,
              studentId: userId,
            },
          });

          created++;
          students.push({ username, name, status: 'created' });
        }
      } catch (err) {
        const msg = `Row ${rowNum}: Failed to process "${username}" — ${err instanceof Error ? err.message : 'Unknown error'}`;
        errors.push(msg);
        students.push({ username, name, status: 'error', message: msg });
      }
    }

    return NextResponse.json({
      message: 'Upload processed successfully',
      summary: { created, skipped, errors },
      students,
    });
  } catch (error) {
    console.error('Excel upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
