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
          title: 'Programming Fundamentals',
          description: 'Learn the basics of programming and Python',
        },
      }),
      prisma.chapter.upsert({
        where: { number: 1 },
        update: {},
        create: {
          number: 1,
          title: 'Lists and Arrays',
          description: 'Master Python lists and array operations',
        },
      }),
      prisma.chapter.upsert({
        where: { number: 2 },
        update: {},
        create: {
          number: 2,
          title: 'Advanced Lists',
          description: 'Advanced list operations and comprehensions',
        },
      }),
      prisma.chapter.upsert({
        where: { number: 3 },
        update: {},
        create: {
          number: 3,
          title: 'Dictionaries',
          description: 'Python dictionaries and data structures',
        },
      }),
      prisma.chapter.upsert({
        where: { number: 4 },
        update: {},
        create: {
          number: 4,
          title: 'Loops and Iteration',
          description: 'Master loops and iteration patterns',
        },
      }),
      prisma.chapter.upsert({
        where: { number: 5 },
        update: {},
        create: {
          number: 5,
          title: 'Functions',
          description: 'Create and use functions in Python',
        },
      }),
    ]);

    // Create sample lessons for each chapter
    for (const chapter of chapters) {
      const lessonCount = 4; // 4 lessons per chapter
      
      for (let i = 1; i <= lessonCount; i++) {
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
            title: `Lesson ${i}: ${chapter.title.split(' ')[0]} Basics`,
            description: `Learn the fundamentals of ${chapter.title.toLowerCase()}`,
            content: JSON.stringify({
              type: 'lesson',
              sections: [
                {
                  title: 'Introduction',
                  content: `Welcome to lesson ${i} of ${chapter.title}`,
                },
                {
                  title: 'Practice',
                  content: 'Try the exercises below',
                },
              ],
            }),
          },
        });
      }

      // Create sample challenges for each chapter
      const challengeCount = 3; // 3 challenges per chapter
      
      for (let i = 1; i <= challengeCount; i++) {
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
            title: `Challenge ${i}: ${chapter.title} Master`,
            description: `Test your ${chapter.title.toLowerCase()} skills`,
            difficulty: i === 1 ? 'EASY' : i === 2 ? 'MEDIUM' : 'HARD',
            points: i * 10, // 10, 20, 30 points
          },
        });
      }
    }

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        email: 'admin@pythonlearning.com',
        password: adminPassword,
        name: 'Administrator',
        role: 'ADMIN',
      },
    });

    // Create sample user
    const userPassword = await hashPassword('user123');
    await prisma.user.upsert({
      where: { username: 'student' },
      update: {},
      create: {
        username: 'student',
        email: 'student@pythonlearning.com',
        password: userPassword,
        name: 'Sample Student',
        role: 'USER',
      },
    });

    console.log('Database seeded successfully!');
    console.log('Admin credentials: admin / admin123');
    console.log('Student credentials: student / user123');
    
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