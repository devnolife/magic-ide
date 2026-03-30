"use client";

import React, { useState, useEffect } from 'react';
import { useChapterProgress } from '@/hooks/useChapterProgress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lesson1OOP } from './Lesson1OOP';
import { Lesson2ErrorHandling } from './Lesson2ErrorHandling';
import { Lesson3FileOperations } from './Lesson3FileOperations';
import { Lesson4Modules } from './Lesson4Modules';

const lessonIdToNumber: Record<string, number> = {
  'lesson1': 1,
  'lesson2': 2,
  'lesson3': 3,
  'lesson4': 4,
};

interface Chapter5ContainerProps {
  onComplete?: () => void;
}

export function Chapter5Container({ onComplete }: Chapter5ContainerProps) {
  const [currentLesson, setCurrentLesson] = useState('lesson1');
  const [unlockedLessons, setUnlockedLessons] = useState(['lesson1']);
  const { completedLessonNumbers, saveLesson, loading } = useChapterProgress(5);

  useEffect(() => {
    if (loading) return;
    const unlocked = ['lesson1'];
    const lessonIds = ['lesson1', 'lesson2', 'lesson3', 'lesson4'];
    for (let i = 0; i < lessonIds.length; i++) {
      const num = i + 1;
      if (completedLessonNumbers.has(num) && i + 1 < lessonIds.length) {
        if (!unlocked.includes(lessonIds[i + 1])) {
          unlocked.push(lessonIds[i + 1]);
        }
      }
    }
    setUnlockedLessons(unlocked);

    if (completedLessonNumbers.size >= 4 && onComplete) {
      onComplete();
    }
  }, [completedLessonNumbers, loading, onComplete]);

  const lessons = [
    {
      id: 'lesson1',
      title: 'OOP & Classes',
      description: 'Kuasai pemrograman berorientasi objek dengan class dan inheritance',
      icon: '🏗️',
      difficulty: 'Apprentice',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200',
    },
    {
      id: 'lesson2',
      title: 'Error Handling',
      description: 'Pelajari cara menangani error dengan try/except/finally',
      icon: '🛡️',
      difficulty: 'Adept',
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
    },
    {
      id: 'lesson3',
      title: 'File Operations',
      description: 'Baca dan tulis file dengan Python I/O',
      icon: '📂',
      difficulty: 'Expert',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      id: 'lesson4',
      title: 'Modules & Packages',
      description: 'Organisasi kode dengan modul dan paket Python',
      icon: '📦',
      difficulty: 'Master',
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-200',
    },
  ];

  const unlockNextLesson = (completedLessonId: string) => {
    const currentIndex = lessons.findIndex(l => l.id === completedLessonId);
    if (currentIndex < lessons.length - 1) {
      const nextLessonId = lessons[currentIndex + 1].id;
      if (!unlockedLessons.includes(nextLessonId)) {
        setUnlockedLessons(prev => [...prev, nextLessonId]);
      }
    }

    const lessonNumber = lessonIdToNumber[completedLessonId];
    if (lessonNumber) {
      const lesson = lessons.find(l => l.id === completedLessonId);
      saveLesson(lessonNumber, lesson?.title);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Apprentice': return 'bg-green-100 text-green-800';
      case 'Adept': return 'bg-blue-100 text-blue-800';
      case 'Expert': return 'bg-yellow-100 text-yellow-800';
      case 'Master': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Chapter Header */}
      <Card className="mb-8 bg-gradient-to-r from-violet-50 via-fuchsia-50 to-cyan-50 border-2 border-violet-200 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <span className="text-6xl">🧙‍♂️</span>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-violet-400 rounded-full animate-ping" />
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-fuchsia-400 rounded-full animate-bounce" />
              <div className="absolute top-1 -left-4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Akademi Konsep Lanjutan Python
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pelajari teknik-teknik Python tingkat lanjut: OOP, Error Handling, File I/O, dan Modules.
            Setiap pelajaran membuka kekuatan baru dalam perjalanan coding-mu!
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Lesson Navigation */}
      <Tabs value={currentLesson} onValueChange={setCurrentLesson}>
        <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/80 backdrop-blur-sm border border-violet-200 shadow-lg">
          {lessons.map((lesson) => (
            <TabsTrigger
              key={lesson.id}
              value={lesson.id}
              disabled={!unlockedLessons.includes(lesson.id)}
              className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${lesson.color} data-[state=active]:text-white
                         disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 relative group`}
            >
              <div className="flex flex-col items-center space-y-1 p-2">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {unlockedLessons.includes(lesson.id) ? lesson.icon : '🔒'}
                </span>
                <span className="text-xs font-medium hidden sm:block">{lesson.title.split(' ')[0]}</span>
                {unlockedLessons.includes(lesson.id) && (
                  <Badge variant="secondary" className={`text-xs ${getDifficultyColor(lesson.difficulty)} hidden lg:block`}>
                    {lesson.difficulty}
                  </Badge>
                )}
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="lesson1" className="space-y-6">
          <Lesson1OOP onComplete={() => unlockNextLesson('lesson1')} />
        </TabsContent>

        <TabsContent value="lesson2" className="space-y-6">
          <Lesson2ErrorHandling onComplete={() => unlockNextLesson('lesson2')} />
        </TabsContent>

        <TabsContent value="lesson3" className="space-y-6">
          <Lesson3FileOperations onComplete={() => unlockNextLesson('lesson3')} />
        </TabsContent>

        <TabsContent value="lesson4" className="space-y-6">
          <Lesson4Modules onComplete={() => unlockNextLesson('lesson4')} />
        </TabsContent>
      </Tabs>

      {/* Progress Indicator */}
      <Card className="mt-8 bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Progress Chapter 5</h3>
            <Badge variant="outline" className="bg-white">
              {unlockedLessons.length} / {lessons.length} Pelajaran Terbuka
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(unlockedLessons.length / lessons.length) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {lessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${unlockedLessons.includes(lesson.id)
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
                  : 'bg-gray-300'
                }`} />
                <span className={`text-sm ${unlockedLessons.includes(lesson.id) ? 'text-gray-800' : 'text-gray-400'}`}>
                  {lesson.title}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
