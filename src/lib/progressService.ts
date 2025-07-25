import { prisma } from '@/lib/prisma'

export interface ChapterProgressData {
  userId: string
  chapterNumber: number
  completedLessons?: number
  totalLessons?: number
  timeSpent?: number
}

export interface LessonProgressData {
  chapterProgressId: string
  lessonNumber: number
  lessonTitle: string
  timeSpent?: number
  challengesCompleted?: number
  totalChallenges?: number
  isCompleted?: boolean
}

export interface AnalyticsData {
  userId: string
  date?: Date
  timeSpent: number
  chaptersVisited: number[]
  lessonsCompleted?: number
  challengesCompleted?: number
}

export class ProgressService {
  /**
   * Initialize chapter progress for a user
   */
  static async initializeChapterProgress(userId: string, chapterNumber: number) {
    try {
      // Check if progress already exists
      const existing = await prisma.chapterProgress.findUnique({
        where: {
          userId_chapterNumber: {
            userId,
            chapterNumber
          }
        }
      })

      if (existing) {
        return existing
      }

      // Create new chapter progress
      return await prisma.chapterProgress.create({
        data: {
          userId,
          chapterNumber,
          totalLessons: this.getChapterLessonCount(chapterNumber)
        }
      })
    } catch (error) {
      console.error('Error initializing chapter progress:', error)
      throw new Error('Failed to initialize chapter progress')
    }
  }

  /**
   * Update chapter progress
   */
  static async updateChapterProgress(data: ChapterProgressData) {
    try {
      const { userId, chapterNumber, ...updateData } = data

      // First ensure the chapter progress exists
      await this.initializeChapterProgress(userId, chapterNumber)

      // Calculate completion status
      const isCompleted = updateData.completedLessons && updateData.totalLessons
        ? updateData.completedLessons >= updateData.totalLessons
        : undefined

      return await prisma.chapterProgress.update({
        where: {
          userId_chapterNumber: {
            userId,
            chapterNumber
          }
        },
        data: {
          ...updateData,
          isCompleted: isCompleted ?? undefined,
          lastAccessed: new Date()
        }
      })
    } catch (error) {
      console.error('Error updating chapter progress:', error)
      throw new Error('Failed to update chapter progress')
    }
  }

  /**
   * Record lesson progress
   */
  static async recordLessonProgress(data: LessonProgressData) {
    try {
      const existing = await prisma.lessonProgress.findUnique({
        where: {
          chapterProgressId_lessonNumber: {
            chapterProgressId: data.chapterProgressId,
            lessonNumber: data.lessonNumber
          }
        }
      })

      if (existing) {
        // Update existing lesson progress
        return await prisma.lessonProgress.update({
          where: {
            chapterProgressId_lessonNumber: {
              chapterProgressId: data.chapterProgressId,
              lessonNumber: data.lessonNumber
            }
          },
          data: {
            timeSpent: (existing.timeSpent || 0) + (data.timeSpent || 0),
            challengesCompleted: data.challengesCompleted ?? existing.challengesCompleted,
            totalChallenges: data.totalChallenges ?? existing.totalChallenges,
            isCompleted: data.isCompleted ?? existing.isCompleted,
            completedAt: data.isCompleted ? new Date() : existing.completedAt
          }
        })
      } else {
        // Create new lesson progress
        return await prisma.lessonProgress.create({
          data: {
            ...data,
            completedAt: data.isCompleted ? new Date() : null
          }
        })
      }
    } catch (error) {
      console.error('Error recording lesson progress:', error)
      throw new Error('Failed to record lesson progress')
    }
  }

  /**
   * Mark lesson as completed
   */
  static async completLesson(
    userId: string,
    chapterNumber: number,
    lessonNumber: number,
    lessonTitle: string,
    timeSpent: number = 0
  ) {
    try {
      // Get or create chapter progress
      const chapterProgress = await this.initializeChapterProgress(userId, chapterNumber)

      // Record lesson completion
      await this.recordLessonProgress({
        chapterProgressId: chapterProgress.id,
        lessonNumber,
        lessonTitle,
        timeSpent,
        isCompleted: true
      })

      // Update chapter progress
      const completedLessons = await prisma.lessonProgress.count({
        where: {
          chapterProgressId: chapterProgress.id,
          isCompleted: true
        }
      })

      await this.updateChapterProgress({
        userId,
        chapterNumber,
        completedLessons,
        timeSpent: (chapterProgress.timeSpent || 0) + timeSpent
      })

      return true
    } catch (error) {
      console.error('Error completing lesson:', error)
      throw new Error('Failed to complete lesson')
    }
  }

  /**
   * Record user analytics
   */
  static async recordAnalytics(data: AnalyticsData) {
    try {
      const today = data.date || new Date()
      today.setHours(0, 0, 0, 0) // Start of day

      const existing = await prisma.learningAnalytics.findUnique({
        where: {
          userId_date: {
            userId: data.userId,
            date: today
          }
        }
      })

      if (existing) {
        // Update existing analytics
        const updatedChapters = new Set([
          ...(existing.chaptersVisited as number[]),
          ...data.chaptersVisited
        ])

        return await prisma.learningAnalytics.update({
          where: {
            userId_date: {
              userId: data.userId,
              date: today
            }
          },
          data: {
            totalTimeSpent: existing.totalTimeSpent + data.timeSpent,
            chaptersVisited: Array.from(updatedChapters),
            lessonsCompleted: existing.lessonsCompleted + (data.lessonsCompleted || 0),
            challengesCompleted: existing.challengesCompleted + (data.challengesCompleted || 0)
          }
        })
      } else {
        // Create new analytics record
        return await prisma.learningAnalytics.create({
          data: {
            userId: data.userId,
            date: today,
            totalTimeSpent: data.timeSpent,
            chaptersVisited: data.chaptersVisited,
            lessonsCompleted: data.lessonsCompleted || 0,
            challengesCompleted: data.challengesCompleted || 0
          }
        })
      }
    } catch (error) {
      console.error('Error recording analytics:', error)
      throw new Error('Failed to record analytics')
    }
  }

  /**
   * Get user's overall progress
   */
  static async getUserProgress(userId: string) {
    try {
      const chapterProgress = await prisma.chapterProgress.findMany({
        where: { userId },
        include: {
          lessonProgress: {
            orderBy: { lessonNumber: 'asc' }
          }
        },
        orderBy: { chapterNumber: 'asc' }
      })

      const analytics = await prisma.learningAnalytics.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 30 // Last 30 days
      })

      const totalTimeSpent = analytics.reduce((sum, day) => sum + day.totalTimeSpent, 0)
      const totalLessonsCompleted = chapterProgress.reduce(
        (sum, chapter) => sum + chapter.completedLessons,
        0
      )

      return {
        chapterProgress,
        analytics,
        summary: {
          totalTimeSpent,
          totalLessonsCompleted,
          chaptersStarted: chapterProgress.length,
          chaptersCompleted: chapterProgress.filter(c => c.isCompleted).length
        }
      }
    } catch (error) {
      console.error('Error getting user progress:', error)
      throw new Error('Failed to get user progress')
    }
  }

  /**
   * Get chapter-specific progress
   */
  static async getChapterProgress(userId: string, chapterNumber: number) {
    try {
      return await prisma.chapterProgress.findUnique({
        where: {
          userId_chapterNumber: {
            userId,
            chapterNumber
          }
        },
        include: {
          lessonProgress: {
            orderBy: { lessonNumber: 'asc' }
          }
        }
      })
    } catch (error) {
      console.error('Error getting chapter progress:', error)
      throw new Error('Failed to get chapter progress')
    }
  }

  /**
   * Track time spent in chapter/lesson
   */
  static async trackTimeSpent(
    userId: string,
    chapterNumber: number,
    timeSpent: number,
    lessonNumber?: number
  ) {
    try {
      // Record in analytics
      await this.recordAnalytics({
        userId,
        timeSpent,
        chaptersVisited: [chapterNumber]
      })

      // Update chapter progress
      const chapterProgress = await this.initializeChapterProgress(userId, chapterNumber)
      await this.updateChapterProgress({
        userId,
        chapterNumber,
        timeSpent: timeSpent
      })

      // If specific lesson, update lesson progress too
      if (lessonNumber !== undefined) {
        await this.recordLessonProgress({
          chapterProgressId: chapterProgress.id,
          lessonNumber,
          lessonTitle: `Lesson ${lessonNumber}`,
          timeSpent
        })
      }

      return true
    } catch (error) {
      console.error('Error tracking time:', error)
      throw new Error('Failed to track time')
    }
  }

  /**
   * Get default lesson count for each chapter
   */
  private static getChapterLessonCount(chapterNumber: number): number {
    const lessonCounts: Record<number, number> = {
      0: 4, // Programming basics, Variables, Data Types, Operations
      1: 4, // Lists introduction
      2: 4, // Advanced Lists
      3: 4, // Dictionaries
      4: 4, // Loops
      5: 4  // Functions
    }

    return lessonCounts[chapterNumber] || 4
  }

  /**
   * Calculate learning streak
   */
  static async calculateStreak(userId: string): Promise<number> {
    try {
      const analytics = await prisma.learningAnalytics.findMany({
        where: {
          userId,
          totalTimeSpent: { gt: 0 } // Only days with actual learning time
        },
        orderBy: { date: 'desc' }
      })

      if (analytics.length === 0) return 0

      let streak = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (const record of analytics) {
        const recordDate = new Date(record.date)
        recordDate.setHours(0, 0, 0, 0)

        const daysDiff = Math.floor((today.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24))

        if (daysDiff === streak) {
          streak++
        } else {
          break
        }
      }

      return streak
    } catch (error) {
      console.error('Error calculating streak:', error)
      return 0
    }
  }
}
