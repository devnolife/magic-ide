"use client";

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, GraduationCap, Lightbulb, Monitor } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

export default function TeacherMaterialsChapterPage() {
  const params = useParams();
  const chapterId = Number(params.chapterId);
  const [activeLessonId, setActiveLessonId] = useState<string>('');

  const chapter = chaptersData.find(c => c.id === chapterId);
  const lessons = useMemo(() => chapterLessons[chapterId] || [], [chapterId]);

  useEffect(() => {
    if (lessons.length > 0) {
      setActiveLessonId(lessons[0].id);
    }
  }, [lessons]);

  const currentLesson = useMemo(
    () => lessons.find(l => l.id === activeLessonId) || lessons[0],
    [lessons, activeLessonId],
  );

  const tips: TeachingTip | undefined = teachingTips[chapterId]?.[currentLesson?.id];

  if (!chapter) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-lg text-muted-foreground">Chapter tidak ditemukan.</p>
        <Link href="/teacher/materials">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </Link>
      </div>
    );
  }

  const LessonComponent = currentLesson?.component;

  return (
    <div className="space-y-6">
      {/* Mode Guru Banner */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 p-4 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                📚 Mode Guru — Materi Mengajar
                <Badge className="bg-white/20 text-white border-white/30 text-xs">
                  Versi Guru
                </Badge>
              </h2>
              <p className="text-emerald-100 text-sm">
                Tampilan khusus guru dengan tips mengajar. Siswa melihat versi berbeda.
              </p>
            </div>
          </div>
          <Link href={`/teacher/materials/${chapterId}/present`}>
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30" variant="outline">
              <Monitor className="mr-2 h-4 w-4" />
              Mode Presentasi
            </Button>
          </Link>
        </div>
      </div>

      {/* Back link */}
      <Link href="/teacher/materials" className="inline-flex items-center text-sm text-muted-foreground hover:text-emerald-600 transition-colors">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Kembali ke Daftar Materi
      </Link>

      {/* Chapter header */}
      <div className="flex items-center gap-4">
        <span className="text-4xl">{chapter.icon}</span>
        <div>
          <h1 className="text-2xl font-bold">{chapter.title}</h1>
          <p className="text-muted-foreground">{chapter.description}</p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          <BookOpen className="mr-1 h-3 w-3" />
          {lessons.length} Materi
        </Badge>
      </div>

      <Separator />

      {/* Main content - 3 column layout */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Lesson list */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Daftar Materi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {lessons.map((lesson) => (
                  <Button
                    key={lesson.id}
                    variant={activeLessonId === lesson.id ? 'default' : 'ghost'}
                    className={`w-full justify-start text-left h-auto py-2 px-3 ${
                      activeLessonId === lesson.id
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'hover:bg-emerald-50'
                    }`}
                    onClick={() => setActiveLessonId(lesson.id)}
                  >
                    <span className="mr-2 text-base">{lesson.icon}</span>
                    <span className="text-sm truncate">{lesson.title}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Center - Lesson content preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                  👁️ Preview Materi Siswa
                </Badge>
              </div>
              <CardTitle className="flex items-center gap-2">
                <span>{currentLesson?.icon}</span>
                {currentLesson?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {LessonComponent && (
                <LessonComponent onComplete={noop} isCompleted={false} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Teaching tips */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            {tips ? (
              <>
                <Card className="border-emerald-200 bg-emerald-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-emerald-800">
                      <Lightbulb className="h-4 w-4" />
                      🎯 Tujuan Pembelajaran
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-emerald-900">
                      {tips.objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-emerald-200 bg-emerald-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-emerald-800">
                      📌 Poin Kunci
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-emerald-900">
                      {tips.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 mt-0.5 shrink-0">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
                      ⚠️ Kesalahan Umum
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-amber-900">
                      {tips.commonMistakes.map((mistake, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2 text-blue-800">
                      💬 Pertanyaan Diskusi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-blue-900">
                      {tips.discussionQuestions.map((q, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-500 mt-0.5 shrink-0">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {tips.teachingNotes && (
                  <Card className="border-purple-200 bg-purple-50/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-purple-800">
                        📝 Catatan Mengajar
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm italic text-purple-700">{tips.teachingNotes}</p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="border-muted">
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Tips mengajar belum tersedia untuk materi ini.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
