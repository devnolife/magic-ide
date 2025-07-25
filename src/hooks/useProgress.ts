import { useState, useEffect, useCallback } from 'react'

export interface LessonProgress {
  id: string
  lessonNumber: number
  lessonTitle: string
  isCompleted: boolean
  timeSpent: number
  challengesCompleted: number
  totalChallenges: number
  completedAt?: string
}

export interface ChapterProgress {
  id: string
  chapterNumber: number
  isCompleted: boolean
  completedLessons: number
  totalLessons: number
  timeSpent: number
  lastAccessed: string
  lessonProgress: LessonProgress[]
}

export interface ProgressSummary {
  totalTimeSpent: number
  totalLessonsCompleted: number
  chaptersStarted: number
  chaptersCompleted: number
}

export interface UserProgress {
  chapterProgress: ChapterProgress[]
  analytics: any[]
  summary: ProgressSummary
  streak?: number
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProgress = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/progress')
      const result = await response.json()

      if (result.success) {
        setProgress(result.data)
        setError(null)
      } else {
        setError(result.error || 'Failed to fetch progress')
      }
    } catch (err) {
      console.error('Error fetching progress:', err)
      setError('Failed to fetch progress')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const completeLesson = useCallback(async (
    chapterNumber: number,
    lessonNumber: number,
    lessonTitle: string,
    timeSpent: number = 0
  ) => {
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'complete_lesson',
          data: {
            chapterNumber,
            lessonNumber,
            lessonTitle,
            timeSpent
          }
        })
      })

      const result = await response.json()
      if (result.success) {
        // Refresh progress data
        await fetchProgress()
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error completing lesson:', error)
      return { success: false, error: 'Failed to complete lesson' }
    }
  }, [fetchProgress])

  const trackTime = useCallback(async (
    chapterNumber: number,
    timeSpent: number,
    lessonNumber?: number
  ) => {
    try {
      const response = await fetch('/api/time-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chapterNumber,
          timeSpent,
          lessonNumber,
          action: 'end_session'
        })
      })

      const result = await response.json()
      if (result.success) {
        // Refresh progress data
        await fetchProgress()
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      console.error('Error tracking time:', error)
      return { success: false, error: 'Failed to track time' }
    }
  }, [fetchProgress])

  const getChapterProgress = useCallback((chapterNumber: number): ChapterProgress | null => {
    if (!progress) return null
    return progress.chapterProgress.find(cp => cp.chapterNumber === chapterNumber) || null
  }, [progress])

  const getLessonProgress = useCallback((
    chapterNumber: number,
    lessonNumber: number
  ): LessonProgress | null => {
    const chapter = getChapterProgress(chapterNumber)
    if (!chapter) return null
    return chapter.lessonProgress.find(lp => lp.lessonNumber === lessonNumber) || null
  }, [getChapterProgress])

  const isLessonCompleted = useCallback((
    chapterNumber: number,
    lessonNumber: number
  ): boolean => {
    const lesson = getLessonProgress(chapterNumber, lessonNumber)
    return lesson?.isCompleted || false
  }, [getLessonProgress])

  const getChapterCompletionPercentage = useCallback((chapterNumber: number): number => {
    const chapter = getChapterProgress(chapterNumber)
    if (!chapter || chapter.totalLessons === 0) return 0
    return Math.round((chapter.completedLessons / chapter.totalLessons) * 100)
  }, [getChapterProgress])

  // Fetch progress on mount
  useEffect(() => {
    fetchProgress()
  }, [fetchProgress])

  return {
    progress,
    isLoading,
    error,
    fetchProgress,
    completeLesson,
    trackTime,
    getChapterProgress,
    getLessonProgress,
    isLessonCompleted,
    getChapterCompletionPercentage
  }
}
