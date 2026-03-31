"use client";

import { useState, useEffect, useCallback } from 'react';

interface LessonProgressData {
  id: string;
  status: string;
  timeSpent: number;
  completedAt: string | null;
  lesson: {
    id: string;
    number: number;
    title: string;
  };
}

interface ChapterProgressData {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterDescription: string;
  totalLessons: number;
  completedLessons: number;
  totalPoints: number;
  timeSpent: number;
  status: 'not-started' | 'in-progress' | 'completed';
  progressPercent: number;
  lessonProgress: LessonProgressData[];
}

interface UseProgressTrackingReturn {
  progress: ChapterProgressData[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  totalPoints: number;
  totalTimeSpent: number;
  overallPercent: number;
}

export function useProgressTracking(): UseProgressTrackingReturn {
  const [progress, setProgress] = useState<ChapterProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setProgress([]);
        return;
      }

      const res = await fetch('/api/progress', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setProgress(data.progress ?? []);
      } else {
        setError('Gagal memuat data progress');
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError('Terjadi kesalahan saat memuat progress');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const totalPoints = progress.reduce((sum, ch) => sum + ch.totalPoints, 0);
  const totalTimeSpent = progress.reduce((sum, ch) => sum + ch.timeSpent, 0);
  const totalLessons = progress.reduce((sum, ch) => sum + ch.totalLessons, 0);
  const completedLessons = progress.reduce((sum, ch) => sum + ch.completedLessons, 0);
  const overallPercent = totalLessons > 0 ? Math.min(Math.round((completedLessons / totalLessons) * 100), 100) : 0;

  return {
    progress,
    loading,
    error,
    refresh: fetchProgress,
    totalPoints,
    totalTimeSpent,
    overallPercent,
  };
}
