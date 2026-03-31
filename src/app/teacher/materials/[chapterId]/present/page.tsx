"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, X, Lightbulb, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { chaptersData } from '@/data/dashboardData';
import { teachingTips, TeachingTip } from '@/data/teachingTips';

// Chapter 0
import Lesson1Programming from '@/components/chapter0/Lesson1Programming';
import Lesson2Variables from '@/components/chapter0/Lesson2Variables';
import Lesson3DataTypes from '@/components/chapter0/Lesson3DataTypes';
import Lesson4Operations from '@/components/chapter0/Lesson4Operations';

// Chapter 1 (lists)
import { Lesson1Introduction } from '@/components/lists/Lesson1Introduction';
import { Lesson2Creation } from '@/components/lists/Lesson2Creation';
import { Lesson3BasicOperations } from '@/components/lists/Lesson3BasicOperations';
import { Lesson4IndexingSlicing } from '@/components/lists/Lesson4IndexingSlicing';
import { Lesson5Methods } from '@/components/lists/Lesson5Methods';

// Chapter 2
import { Lesson1Comprehension } from '@/components/chapter2/Lesson1Comprehension';
import { Lesson2NestedLists } from '@/components/chapter2/Lesson2NestedLists';
import { Lesson3ListMethods } from '@/components/chapter2/Lesson3ListMethods';
import { Lesson4ListTricks } from '@/components/chapter2/Lesson4ListTricks';

// Chapter 3
import { Lesson1Dictionary } from '@/components/chapter3/Lesson1Dictionary';
import { Lesson2Methods } from '@/components/chapter3/Lesson2Methods';
import { Lesson3NestedDict } from '@/components/chapter3/Lesson3NestedDict';
import { Lesson4Objects } from '@/components/chapter3/Lesson4Objects';

// Chapter 4
import { Lesson1ForLoops } from '@/components/chapter4/Lesson1ForLoops';
import { Lesson2WhileLoops } from '@/components/chapter4/Lesson2WhileLoops';
import { Lesson3NestedLoops } from '@/components/chapter4/Lesson3NestedLoops';
import { Lesson4Comprehensions } from '@/components/chapter4/Lesson4Comprehensions';

// Chapter 5
import { Lesson1OOP } from '@/components/chapter5/Lesson1OOP';
import { Lesson2ErrorHandling } from '@/components/chapter5/Lesson2ErrorHandling';
import { Lesson3FileOperations } from '@/components/chapter5/Lesson3FileOperations';
import { Lesson4Modules } from '@/components/chapter5/Lesson4Modules';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LessonComponentType = React.ComponentType<any>;

interface LessonInfo {
  id: string;
  title: string;
  icon: string;
  component: LessonComponentType;
}

const chapterLessons: Record<number, LessonInfo[]> = {
  0: [
    { id: '1', title: 'Apa itu Pemrograman?', icon: '🤖', component: Lesson1Programming },
    { id: '2', title: 'Variabel & Memori', icon: '📦', component: Lesson2Variables },
    { id: '3', title: 'Tipe Data Python', icon: '🎭', component: Lesson3DataTypes },
    { id: '4', title: 'Operasi Dasar', icon: '⚙️', component: Lesson4Operations },
  ],
  1: [
    { id: 'introduction', title: 'Pengenalan List Python', icon: '📖', component: Lesson1Introduction },
    { id: 'creation', title: 'Membuat List', icon: '🔧', component: Lesson2Creation },
    { id: 'operations', title: 'Operasi Dasar List', icon: '⚡', component: Lesson3BasicOperations },
    { id: 'indexing', title: 'Indexing & Slicing', icon: '🎯', component: Lesson4IndexingSlicing },
    { id: 'methods', title: 'List Methods', icon: '🎨', component: Lesson5Methods },
  ],
  2: [
    { id: 'comprehension', title: 'List Comprehension', icon: '✨', component: Lesson1Comprehension },
    { id: 'nested-lists', title: 'Nested Lists', icon: '📐', component: Lesson2NestedLists },
    { id: 'list-methods', title: 'Advanced Methods', icon: '🧰', component: Lesson3ListMethods },
    { id: 'list-tricks', title: 'List Tricks', icon: '🎩', component: Lesson4ListTricks },
  ],
  3: [
    { id: 'lesson1', title: 'Dictionary Dasar', icon: '📖', component: Lesson1Dictionary },
    { id: 'lesson2', title: 'Metode Dictionary', icon: '🔑', component: Lesson2Methods },
    { id: 'lesson3', title: 'Nested Dictionary', icon: '🏗️', component: Lesson3NestedDict },
    { id: 'lesson4', title: 'Dictionary & Objects', icon: '🎓', component: Lesson4Objects },
  ],
  4: [
    { id: 'lesson1', title: 'For Loop', icon: '🔁', component: Lesson1ForLoops },
    { id: 'lesson2', title: 'While Loop', icon: '⚡', component: Lesson2WhileLoops },
    { id: 'lesson3', title: 'Nested Loops', icon: '🌀', component: Lesson3NestedLoops },
    { id: 'lesson4', title: 'Comprehension Sorcery', icon: '✨', component: Lesson4Comprehensions },
  ],
  5: [
    { id: 'lesson1', title: 'OOP & Classes', icon: '🏗️', component: Lesson1OOP },
    { id: 'lesson2', title: 'Error Handling', icon: '🛡️', component: Lesson2ErrorHandling },
    { id: 'lesson3', title: 'File Operations', icon: '📂', component: Lesson3FileOperations },
    { id: 'lesson4', title: 'Modules & Packages', icon: '📦', component: Lesson4Modules },
  ],
};

const noop = () => {};

export default function PresentationPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = Number(params.chapterId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTips, setShowTips] = useState(false);

  const chapter = useMemo(
    () => chaptersData.find((c) => c.id === chapterId),
    [chapterId]
  );

  const lessons = useMemo(
    () => chapterLessons[chapterId] ?? [],
    [chapterId]
  );

  const currentLesson = lessons[currentIndex] as LessonInfo | undefined;
  const LessonComponent = currentLesson?.component;

  const tips: TeachingTip | undefined = useMemo(
    () => teachingTips[chapterId]?.[currentLesson?.id ?? ''],
    [chapterId, currentLesson?.id]
  );

  const goToPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(lessons.length - 1, i + 1));
  }, [lessons.length]);

  const exitPresentation = useCallback(() => {
    router.push(`/teacher/materials/${chapterId}`);
  }, [router, chapterId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      else if (e.key === 'ArrowRight') goToNext();
      else if (e.key === 'Escape') exitPresentation();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrev, goToNext, exitPresentation]);

  if (!chapter || lessons.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg text-gray-600">Chapter tidak ditemukan.</p>
          <Button variant="outline" onClick={() => router.push('/teacher/materials')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-hidden flex flex-col">
      {/* ── Top Toolbar ── */}
      <div className="h-12 bg-gray-900 text-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Monitor className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium truncate">
            {chapter.icon} {chapter.title}
          </span>
        </div>

        <Badge variant="secondary" className="bg-gray-700 text-gray-200 shrink-0">
          Materi {currentIndex + 1} dari {lessons.length}
        </Badge>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className={`text-white hover:bg-gray-700 ${showTips ? 'bg-emerald-700 hover:bg-emerald-600' : ''}`}
            onClick={() => setShowTips((v) => !v)}
            title="Teaching Tips"
          >
            <Lightbulb className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-gray-700"
            onClick={exitPresentation}
            title="Keluar Presentasi (Esc)"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Lesson content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 max-w-5xl mx-auto">
            {LessonComponent && (
              <LessonComponent onComplete={noop} isCompleted={false} />
            )}
          </div>
        </div>

        {/* Teaching Tips Side Panel */}
        {showTips && tips && (
          <aside className="w-[350px] shrink-0 bg-emerald-50 border-l border-emerald-200 overflow-y-auto">
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-emerald-800">Teaching Tips</h3>
              </div>

              <Separator className="bg-emerald-200" />

              {/* Objectives */}
              {tips.objectives.length > 0 && (
                <Card className="border-emerald-200 bg-white">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-sm font-medium text-emerald-700">🎯 Tujuan Pembelajaran</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <ul className="space-y-1">
                      {tips.objectives.map((obj, i) => (
                        <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                          <span className="text-emerald-500 shrink-0">•</span>
                          {obj}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Key Points */}
              {tips.keyPoints.length > 0 && (
                <Card className="border-emerald-200 bg-white">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-sm font-medium text-emerald-700">📌 Poin Penting</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <ul className="space-y-1">
                      {tips.keyPoints.map((point, i) => (
                        <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                          <span className="text-emerald-500 shrink-0">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Common Mistakes */}
              {tips.commonMistakes.length > 0 && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-sm font-medium text-amber-700">⚠️ Kesalahan Umum</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <ul className="space-y-1">
                      {tips.commonMistakes.map((mistake, i) => (
                        <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                          <span className="text-amber-500 shrink-0">•</span>
                          {mistake}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Discussion Questions */}
              {tips.discussionQuestions.length > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-sm font-medium text-blue-700">💬 Pertanyaan Diskusi</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <ul className="space-y-1">
                      {tips.discussionQuestions.map((q, i) => (
                        <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                          <span className="text-blue-500 shrink-0">{i + 1}.</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Teaching Notes */}
              {tips.teachingNotes && (
                <Card className="border-emerald-200 bg-white">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <CardTitle className="text-sm font-medium text-emerald-700">📝 Catatan Pengajar</CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <p className="text-xs text-gray-700 leading-relaxed">{tips.teachingNotes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* ── Bottom Toolbar ── */}
      <div className="h-14 bg-white border-t shadow-sm flex items-center justify-between px-4 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50 disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
          Sebelumnya
        </Button>

        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <span>{currentLesson?.icon}</span>
          <span>{currentLesson?.title}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNext}
          disabled={currentIndex === lessons.length - 1}
          className="gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50 disabled:opacity-40"
        >
          Selanjutnya
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
