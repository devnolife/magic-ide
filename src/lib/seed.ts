import { prisma } from './prisma';
import { hashPassword } from './auth';

export async function seedDatabase() {
  try {
    // Create sample chapters
    const chapters = await Promise.all([
      prisma.chapter.upsert({
        where: { number: 0 },
        update: {},
        create: {
          number: 0,
          title: 'Dasar-Dasar Pemrograman',
          description: 'Pelajari dasar-dasar pemrograman dan Python',
        },
      }),
      prisma.chapter.upsert({
        where: { number: 1 },
        update: {},
        create: {
          number: 1,
          title: 'Variabel dan Tipe Data',
          description: 'Menguasai variabel, tipe data, dan operasi dasar Python',
        },
      }),
      prisma.chapter.upsert({
        where: { number: 2 },
        update: {},
        create: {
          number: 2,
          title: 'List dan Array',
          description: 'Operasi list lanjutan dan list comprehension',
        },
      }),
      prisma.chapter.upsert({
        where: { number: 3 },
        update: {},
        create: {
          number: 3,
          title: 'Dictionary',
          description: 'Dictionary dan struktur data Python',
        },
      }),
      prisma.chapter.upsert({
        where: { number: 4 },
        update: {},
        create: {
          number: 4,
          title: 'Perulangan',
          description: 'Menguasai loop dan pola iterasi',
        },
      }),
      prisma.chapter.upsert({
        where: { number: 5 },
        update: {},
        create: {
          number: 5,
          title: 'Advanced Python',
          description: 'Konsep lanjutan Python: OOP, Error Handling, File I/O, dan Modules',
        },
      }),
    ]);

    // Create sample lessons for each chapter
    const lessonTitles: Record<number, string[]> = {
      0: ['Apa Itu Pemrograman', 'Mengenal Python', 'Instalasi & Setup', 'Program Pertama'],
      1: ['Variabel & Memori', 'Tipe Data Dasar', 'Operasi Aritmatika', 'Input & Output'],
      2: ['Membuat List', 'Operasi List', 'Slicing & Indexing', 'List Comprehension'],
      3: ['Membuat Dictionary', 'Akses & Modifikasi', 'Method Dictionary', 'Nested Dictionary'],
      4: ['For Loop', 'While Loop', 'Loop Control', 'Nested Loop'],
      5: ['Object-Oriented Programming', 'Error Handling', 'File Operations', 'Modules & Packages'],
    };

    for (const chapter of chapters) {
      const titles = lessonTitles[chapter.number] || ['Pelajaran 1', 'Pelajaran 2', 'Pelajaran 3', 'Pelajaran 4'];
      
      for (let i = 1; i <= titles.length; i++) {
        await prisma.lesson.upsert({
          where: {
            chapterId_number: {
              chapterId: chapter.id,
              number: i,
            },
          },
          update: {},
          create: {
            chapterId: chapter.id,
            number: i,
            title: `Pelajaran ${i}: ${titles[i - 1]}`,
            description: `Mempelajari ${titles[i - 1].toLowerCase()} dalam ${chapter.title.toLowerCase()}`,
            content: JSON.stringify({
              type: 'lesson',
              sections: [
                {
                  title: 'Pendahuluan',
                  content: `Selamat datang di pelajaran ${i}: ${titles[i - 1]}`,
                },
                {
                  title: 'Latihan',
                  content: 'Coba kerjakan latihan berikut',
                },
              ],
            }),
          },
        });
      }

      // Create sample challenges for each chapter
      for (let i = 1; i <= 3; i++) {
        await prisma.challenge.upsert({
          where: {
            chapterId_number: {
              chapterId: chapter.id,
              number: i,
            },
          },
          update: {},
          create: {
            chapterId: chapter.id,
            number: i,
            title: `Tantangan ${i}: ${chapter.title}`,
            description: `Uji kemampuan ${chapter.title.toLowerCase()} kamu`,
            difficulty: i === 1 ? 'EASY' : i === 2 ? 'MEDIUM' : 'HARD',
            points: i * 10,
          },
        });
      }
    }

    // Create sample quizzes for first 3 chapters
    for (let ci = 0; ci < 3; ci++) {
      const chapter = chapters[ci];

      const quiz = await prisma.quiz.upsert({
        where: { id: `seed-quiz-ch${chapter.number}` },
        update: {},
        create: {
          id: `seed-quiz-ch${chapter.number}`,
          chapterId: chapter.id,
          title: `Kuis ${chapter.title}`,
          description: `Kuis untuk menguji pemahaman materi ${chapter.title}`,
          timeLimit: 15,
        },
      });

      const sampleQuestions = [
        {
          questionText: `Apa fungsi utama dari ${chapter.title.toLowerCase()}?`,
          questionType: 'MULTIPLE_CHOICE' as const,
          options: JSON.stringify([
            { label: 'A', text: 'Untuk membuat program lebih kompleks', isCorrect: false },
            { label: 'B', text: `Untuk ${chapter.description?.toLowerCase() || 'memahami konsep dasar'}`, isCorrect: true },
            { label: 'C', text: 'Tidak ada fungsi khusus', isCorrect: false },
            { label: 'D', text: 'Hanya untuk dekorasi kode', isCorrect: false },
          ]),
          correctAnswer: 'B',
          points: 10,
          order: 1,
        },
        {
          questionText: 'Python adalah bahasa pemrograman yang bersifat interpreted. Benar atau Salah?',
          questionType: 'TRUE_FALSE' as const,
          correctAnswer: 'true',
          points: 10,
          order: 2,
        },
        {
          questionText: 'Tuliskan output dari: print("Hello World")',
          questionType: 'SHORT_ANSWER' as const,
          correctAnswer: 'Hello World',
          points: 10,
          order: 3,
        },
      ];

      for (const q of sampleQuestions) {
        await prisma.question.upsert({
          where: { id: `seed-q-ch${chapter.number}-${q.order}` },
          update: {},
          create: {
            id: `seed-q-ch${chapter.number}-${q.order}`,
            quizId: quiz.id,
            questionText: q.questionText,
            questionType: q.questionType,
            options: q.options || null,
            correctAnswer: q.correctAnswer,
            points: q.points,
            order: q.order,
          },
        });
      }
    }

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    await prisma.user.upsert({
      where: { username: 'admin' },
      update: { isActivated: true },
      create: {
        username: 'admin',
        email: 'admin@pythonlearning.com',
        password: adminPassword,
        name: 'Administrator',
        role: 'ADMIN',
        isActivated: true,
      },
    });

    // Create sample teacher
    const teacherPassword = await hashPassword('guru123');
    const teacher = await prisma.user.upsert({
      where: { username: 'guru1' },
      update: { isActivated: true },
      create: {
        username: 'guru1',
        email: 'guru1@pythonlearning.com',
        password: teacherPassword,
        name: 'Pak Budi',
        role: 'TEACHER',
        isActivated: true,
      },
    });

    // Create sample student
    const userPassword = await hashPassword('user123');
    const student = await prisma.user.upsert({
      where: { username: 'student' },
      update: {},
      create: {
        username: 'student',
        email: 'student@pythonlearning.com',
        password: userPassword,
        name: 'Andi Pratama',
        role: 'USER',
      },
    });

    // Create sample activation codes
    const sampleCode = await prisma.activationCode.upsert({
      where: { code: 'GURU2025' },
      update: {},
      create: {
        code: 'GURU2025',
        description: 'Kode aktivasi guru tahun ajaran 2025/2026',
        maxUses: 50,
        isActive: true,
      },
    });

    await prisma.activationCode.upsert({
      where: { code: 'TRIALCODE' },
      update: {},
      create: {
        code: 'TRIALCODE',
        description: 'Kode trial untuk demo',
        maxUses: 5,
        isActive: true,
      },
    });

    // Record activation usage for guru1
    await prisma.activationCodeUsage.upsert({
      where: {
        codeId_userId: {
          codeId: sampleCode.id,
          userId: teacher.id,
        },
      },
      update: {},
      create: {
        codeId: sampleCode.id,
        userId: teacher.id,
      },
    });

    // Update activation code usage count
    await prisma.activationCode.update({
      where: { code: 'GURU2025' },
      data: { currentUses: 1 },
    });

    // Create sample classroom and assign student
    const classroom = await prisma.classroom.upsert({
      where: { id: 'seed-classroom-1' },
      update: {},
      create: {
        id: 'seed-classroom-1',
        name: 'Python Kelas 10A',
        description: 'Kelas Python untuk siswa kelas 10A',
        teacherId: teacher.id,
      },
    });

    await prisma.classroomStudent.upsert({
      where: {
        classroomId_studentId: {
          classroomId: classroom.id,
          studentId: student.id,
        },
      },
      update: {},
      create: {
        classroomId: classroom.id,
        studentId: student.id,
      },
    });



    // Create sample exam session for demo
    const seededQuiz = await prisma.quiz.findFirst({
      where: { id: 'seed-quiz-ch0' },
    });

    if (seededQuiz) {
      await prisma.examSession.upsert({
        where: { id: 'seed-exam-session-1' },
        update: {},
        create: {
          id: 'seed-exam-session-1',
          classroomId: classroom.id,
          quizId: seededQuiz.id,
          status: 'SCHEDULED',
          duration: 30,
        },
      });

    }
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seeder if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}