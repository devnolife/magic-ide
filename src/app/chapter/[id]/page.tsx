'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Loader2, Lock } from 'lucide-react';
import { Chapter0Page } from '@/components/chapters/Chapter0Page';
import { Chapter1Page } from '@/components/chapters/Chapter1Page';
import { Chapter2Page } from '@/components/chapters/Chapter2Page';
import { Chapter3Page } from '@/components/chapters/Chapter3Page';
import { Chapter4Page } from '@/components/chapters/Chapter4Page';
import { Chapter5Page } from '@/components/chapters/Chapter5Page';

const chapterComponents: Record<string, React.ComponentType> = {
  '0': Chapter0Page,
  '1': Chapter1Page,
  '2': Chapter2Page,
  '3': Chapter3Page,
  '4': Chapter4Page,
  '5': Chapter5Page,
};

export default function ChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [accessState, setAccessState] = useState<'loading' | 'allowed' | 'locked' | 'not-found'>('loading');

  useEffect(() => {
    params.then((p) => {
      const id = p.id;
      setChapterId(id);

      if (!chapterComponents[id]) {
        setAccessState('not-found');
        return;
      }

      // Chapter 0 is always accessible
      if (id === '0') {
        setAccessState('allowed');
        return;
      }

      // Check if previous chapter is completed
      const token = localStorage.getItem('token');
      if (!token) {
        setAccessState('locked');
        return;
      }

      fetch('/api/progress', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          const progressList = data.progress ?? [];
          const prevChapterNum = parseInt(id) - 1;
          const prevChapter = progressList.find(
            (p: { chapterNumber: number }) => p.chapterNumber === prevChapterNum
          );

          if (prevChapter && prevChapter.status === 'completed') {
            setAccessState('allowed');
          } else {
            setAccessState('locked');
          }
        })
        .catch(() => {
          setAccessState('locked');
        });
    });
  }, [params]);

  if (accessState === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (accessState === 'not-found') {
    notFound();
  }

  if (accessState === 'locked') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="rounded-full bg-muted p-6">
          <Lock className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Chapter Terkunci</h2>
        <p className="text-muted-foreground text-center max-w-md">
          Selesaikan semua lesson di chapter sebelumnya terlebih dahulu untuk membuka chapter ini.
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const ChapterComponent = chapterComponents[chapterId!];
  return <ChapterComponent />;
}
