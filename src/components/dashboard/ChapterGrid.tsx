"use client";

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2 } from 'lucide-react';
import { ChapterCard } from './ChapterCard';
import { chaptersData } from '@/data/dashboardData';

export interface ChapterProgress {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterDescription: string | null;
  totalLessons: number;
  completedLessons: number;
  totalPoints: number;
  timeSpent: number;
  status: 'not-started' | 'in-progress' | 'completed';
  progressPercent: number;
}

interface MergedChapter {
  id: number;
  title: string;
  description: string;
  icon: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  estimatedTime: string;
  href: string;
  isLocked: boolean;
  totalLessons: number;
  completedLessons: number;
}

interface ChapterGridProps {
  onProgressLoaded?: (progress: ChapterProgress[]) => void;
}

export function ChapterGrid({ onProgressLoaded }: ChapterGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [chapters, setChapters] = useState<MergedChapter[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        // No token → show all chapters as locked except first
        const fallback = chaptersData.map((ch, i) => ({
          ...ch,
          isLocked: i > 0,
          totalLessons: 0,
          completedLessons: 0,
        }));
        setChapters(fallback);
        setLoading(false);
        return;
      }

      const res = await fetch('/api/progress', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch progress');

      const data = await res.json();
      const progressList: ChapterProgress[] = data.progress ?? [];

      if (onProgressLoaded) onProgressLoaded(progressList);

      // Merge API progress with static chapter data (icons, estimatedTime, href)
      const merged: MergedChapter[] = chaptersData.map((staticCh) => {
        const apiCh = progressList.find((p) => p.chapterNumber === staticCh.id);

        // Lock logic: chapter N is locked if chapter N-1 is not completed
        // Chapter 0 is always unlocked
        let isLocked = false;
        if (staticCh.id > 0) {
          const prevChapter = progressList.find((p) => p.chapterNumber === staticCh.id - 1);
          isLocked = !prevChapter || prevChapter.status !== 'completed';
        }

        return {
          ...staticCh,
          progress: apiCh?.progressPercent ?? 0,
          status: apiCh?.status ?? 'not-started',
          totalLessons: apiCh?.totalLessons ?? 0,
          completedLessons: apiCh?.completedLessons ?? 0,
          isLocked,
        };
      });

      setChapters(merged);
    } catch (err) {
      console.error('Error fetching progress:', err);
      // Fallback: show all with first unlocked
      const fallback = chaptersData.map((ch, i) => ({
        ...ch,
        isLocked: i > 0,
        totalLessons: 0,
        completedLessons: 0,
      }));
      setChapters(fallback);
    } finally {
      setLoading(false);
    }
  }, [onProgressLoaded]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Filter & search
  const filteredChapters = chapters.filter((ch) => {
    const matchesSearch =
      searchTerm === '' ||
      ch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ch.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || ch.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: chapters.length,
    'not-started': chapters.filter((c) => c.status === 'not-started').length,
    'in-progress': chapters.filter((c) => c.status === 'in-progress').length,
    completed: chapters.filter((c) => c.status === 'completed').length,
  };

  const filterOptions = [
    { value: 'all', label: 'Semua', count: statusCounts.all },
    { value: 'not-started', label: 'Belum Dimulai', count: statusCounts['not-started'] },
    { value: 'in-progress', label: 'Sedang Berjalan', count: statusCounts['in-progress'] },
    { value: 'completed', label: 'Selesai', count: statusCounts.completed },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Pilih Chapter</h2>
          <p className="text-muted-foreground">Mulai perjalanan belajar Python Anda</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari chapter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Filter Badges */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((filter) => (
          <Badge
            key={filter.value}
            variant={activeFilter === filter.value ? 'default' : 'outline'}
            className="cursor-pointer transition-all"
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label} ({filter.count})
          </Badge>
        ))}
      </div>

      {/* Chapter Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChapters.map((chapter, index) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            index={index}
            isLocked={chapter.isLocked}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredChapters.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">Tidak ada chapter ditemukan</h3>
          <p className="text-muted-foreground">Coba ubah kata kunci pencarian atau filter</p>
        </div>
      )}

      {/* Progress Summary */}
      <div className="mt-12 p-6 rounded-xl border bg-card">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Ringkasan Progress</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
              <div className="text-muted-foreground">Selesai</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{statusCounts['in-progress']}</div>
              <div className="text-muted-foreground">Sedang Berjalan</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">{statusCounts['not-started']}</div>
              <div className="text-muted-foreground">Belum Dimulai</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
