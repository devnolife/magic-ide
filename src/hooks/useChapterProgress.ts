"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface ChapterMeta {
  chapterId: string;
  chapterNumber: number;
  title: string;
  lessons: { id: string; number: number; title: string }[];
}

interface UseChapterProgressReturn {
  completedLessonNumbers: Set<number>;
  chapterMeta: ChapterMeta | null;
  loading: boolean;
  savingLesson: number | null;
  saveLesson: (lessonNumber: number, lessonTitle?: string) => Promise<void>;
  isLessonCompleted: (lessonNumber: number) => boolean;
  allLessonsCompleted: boolean;
}

export function useChapterProgress(chapterNumber: number): UseChapterProgressReturn {
  const [completedLessonNumbers, setCompletedLessonNumbers] = useState<Set<number>>(new Set());
  const [chapterMeta, setChapterMeta] = useState<ChapterMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingLesson, setSavingLesson] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('auth-token');

        const metaRes = await fetch(`/api/chapters/${chapterNumber}/lessons`);
        if (metaRes.ok) {
          const meta = await metaRes.json();
          setChapterMeta(meta);
        }

        if (token) {
          const progressRes = await fetch('/api/progress', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (progressRes.ok) {
            const data = await progressRes.json();
            const chProgress = (data.progress ?? []).find(
              (p: { chapterNumber: number }) => p.chapterNumber === chapterNumber
            );

            if (chProgress?.lessonProgress) {
              const completed = new Set<number>();
              for (const lp of chProgress.lessonProgress) {
                if (lp.status === 'COMPLETED' && lp.lesson?.number) {
                  completed.add(lp.lesson.number);
                }
              }
              setCompletedLessonNumbers(completed);
            }
          }
        }
      } catch (err) {
        console.error(`Error loading chapter ${chapterNumber} data:`, err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [chapterNumber]);

  const saveLesson = useCallback(async (lessonNumber: number, lessonTitle?: string) => {
    if (completedLessonNumbers.has(lessonNumber)) return;

    setCompletedLessonNumbers(prev => new Set([...prev, lessonNumber]));
    setSavingLesson(lessonNumber);

    try {
      const token = localStorage.getItem('auth-token');
      if (!token || !chapterMeta) {
        setSavingLesson(null);
        return;
      }

      const dbLesson = chapterMeta.lessons.find(l => l.number === lessonNumber);
      if (!dbLesson) {
        console.error('Lesson not found in DB for number:', lessonNumber);
        setSavingLesson(null);
        return;
      }

      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chapterId: chapterMeta.chapterId,
          lessonId: dbLesson.id,
          status: 'COMPLETED',
          timeSpent: 0,
        }),
      });

      if (res.ok) {
        const title = lessonTitle || dbLesson.title;
        toast.success(`✅ "${title}" tersimpan!`, { duration: 2000 });
      } else {
        console.error('Failed to save lesson progress');
      }
    } catch (err) {
      console.error('Error saving lesson progress:', err);
    } finally {
      setSavingLesson(null);
    }
  }, [completedLessonNumbers, chapterMeta]);

  const isLessonCompleted = useCallback(
    (lessonNumber: number) => completedLessonNumbers.has(lessonNumber),
    [completedLessonNumbers]
  );

  const totalDbLessons = chapterMeta?.lessons.length ?? 0;
  const allLessonsCompleted = totalDbLessons > 0 && completedLessonNumbers.size >= totalDbLessons;

  return {
    completedLessonNumbers,
    chapterMeta,
    loading,
    savingLesson,
    saveLesson,
    isLessonCompleted,
    allLessonsCompleted,
  };
}
