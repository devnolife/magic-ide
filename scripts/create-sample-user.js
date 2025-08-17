// Sample user creation script for testing
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth';

const prisma = new PrismaClient();

async function createSampleUser() {
  try {
    // Create a test user
    const hashedPassword = await hashPassword('password123');

    const user = await prisma.user.create({
      data: {
        username: 'testuser',
        password: hashedPassword,
        fullName: 'Test User',
        isActive: true,
      },
    });

    console.log('Sample user created:', {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
    });

    // Initialize chapter progress for the user
    const chapters = [0, 1, 2, 3, 4, 5];
    const chapterProgressData = chapters.map(chapterNumber => ({
      userId: user.id,
      chapterNumber,
      totalLessons: 4, // Each chapter has 4 lessons
    }));

    await prisma.chapterProgress.createMany({
      data: chapterProgressData,
    });

    console.log('Chapter progress initialized for user');

  } catch (error) {
    console.error('Error creating sample user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSampleUser();
