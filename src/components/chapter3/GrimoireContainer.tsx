"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lesson1Dictionary } from './Lesson1Dictionary';
import { Lesson2Methods } from './Lesson2Methods';
import { Lesson3NestedDict } from './Lesson3NestedDict';
import { Lesson4Objects } from './Lesson4Objects';
import { SpellCraftingPlayground } from './SpellCraftingPlayground';
import styles from './GrimoireContainer.module.css';

export function GrimoireContainer() {
  const [currentLesson, setCurrentLesson] = useState('lesson1');
  const [unlockedLessons, setUnlockedLessons] = useState(['lesson1']);

  const lessons = [
    {
      id: 'lesson1',
      title: 'Dictionary Dasar',
      description: 'Pelajari dasar-dasar Dictionary Python: membuat, mengakses, dan memodifikasi data key-value',
      icon: '📚',
      difficulty: 'Pemula',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      concepts: ['Dict Creation', 'Key-Value Access', 'Basic Operations']
    },
    {
      id: 'lesson2',
      title: 'Metode Dictionary',
      description: 'Kuasai berbagai metode Dictionary seperti keys(), values(), items(), get(), dan update()',
      icon: '�',
      difficulty: 'Menengah',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      concepts: ['Dict Methods', 'Iteration', 'Advanced Access']
    },
    {
      id: 'lesson3',
      title: 'Nested Dictionary',
      description: 'Jelajahi struktur data kompleks dengan dictionary bersarang dan manipulasi data bertingkat',
      icon: '�️',
      difficulty: 'Lanjutan',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      concepts: ['Nested Structures', 'Deep Access', 'Complex Data']
    },
    {
      id: 'lesson4',
      title: 'Dictionary & Objects',
      description: 'Integrasikan Dictionary dengan Object-Oriented Programming dan struktur data lanjutan',
      icon: '🏗️',
      difficulty: 'Ahli',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      concepts: ['OOP Integration', 'Data Modeling', 'Advanced Patterns']
    },
    {
      id: 'playground',
      title: 'Dictionary Playground',
      description: 'Ruang latihan bebas untuk eksperimen dengan semua konsep Dictionary yang telah dipelajari',
      icon: '🎮',
      difficulty: 'Praktik',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      concepts: ['Free Practice', 'Real Projects', 'Experimentation']
    }
  ];

  // Handler untuk mengubah lesson dengan validasi
  const handleLessonChange = (lessonId: string) => {
    if (unlockedLessons.includes(lessonId)) {
      setCurrentLesson(lessonId);
    }
  };

  // Hitung persentase progres
  const progressPercentage = Math.round((unlockedLessons.length / lessons.length) * 100);

  // Generate width class berdasarkan progress
  const getProgressWidthClass = () => {
    if (progressPercentage === 0) return 'w-0';
    if (progressPercentage <= 20) return 'w-1/5';
    if (progressPercentage <= 40) return 'w-2/5';
    if (progressPercentage <= 60) return 'w-3/5';
    if (progressPercentage <= 80) return 'w-4/5';
    return 'w-full';
  };

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, lessonId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLessonChange(lessonId);
    }
  };

  const unlockNextLesson = (completedLessonId: string) => {
    const currentIndex = lessons.findIndex(lesson => lesson.id === completedLessonId);
    if (currentIndex < lessons.length - 1) {
      const nextLessonId = lessons[currentIndex + 1].id;
      if (!unlockedLessons.includes(nextLessonId)) {
        setUnlockedLessons(prev => [...prev, nextLessonId]);
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Pemula': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Menengah': return 'bg-green-100 text-green-800 border-green-200';
      case 'Lanjutan': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Ahli': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Praktik': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Python Dictionary Learning Center */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border-2 border-blue-200 shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <span className="text-6xl">�</span>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-pulse flex items-center justify-center">
                <span className="text-xs text-white font-bold">{`{}`}</span>
              </div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Python Dictionary Learning Center
          </CardTitle>
          <CardDescription className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Selamat datang di pusat pembelajaran Dictionary Python! Di sini Anda akan menguasai salah satu struktur data paling powerful dalam Python.
            Dari dasar key-value pairs hingga struktur data kompleks, mari kita jelajahi dunia Dictionary bersama-sama.
          </CardDescription>

          {/* Learning Path Overview */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 rounded-lg p-3 border border-blue-200">
              <div className="text-2xl mb-1">📚</div>
              <div className="text-sm font-semibold text-gray-800">Dictionary Basics</div>
              <div className="text-xs text-gray-600">Key-Value Fundamentals</div>
            </div>
            <div className="bg-white/80 rounded-lg p-3 border border-green-200">
              <div className="text-2xl mb-1">🔧</div>
              <div className="text-sm font-semibold text-gray-800">Built-in Methods</div>
              <div className="text-xs text-gray-600">Essential Operations</div>
            </div>
            <div className="bg-white/80 rounded-lg p-3 border border-purple-200">
              <div className="text-2xl mb-1">🗂️</div>
              <div className="text-sm font-semibold text-gray-800">Nested Data</div>
              <div className="text-xs text-gray-600">Complex Structures</div>
            </div>
            <div className="bg-white/80 rounded-lg p-3 border border-orange-200">
              <div className="text-2xl mb-1">🏗️</div>
              <div className="text-sm font-semibold text-gray-800">Real Applications</div>
              <div className="text-xs text-gray-600">Practical Projects</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Learning Modules Navigation */}
      <Tabs value={currentLesson} onValueChange={handleLessonChange}>
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 bg-white/95 backdrop-blur-sm border border-blue-200/50 shadow-xl rounded-2xl p-6">
          {lessons.map((lesson) => (
            <TabsTrigger
              key={lesson.id}
              value={lesson.id}
              disabled={!unlockedLessons.includes(lesson.id)}
              className={`${styles.lessonTab} relative group flex flex-col items-center justify-between
                         min-h-[180px] w-full p-0 border-0
                         data-[state=active]:bg-gradient-to-br data-[state=active]:${lesson.color} 
                         data-[state=active]:text-white data-[state=active]:shadow-lg
                         disabled:opacity-50 disabled:cursor-not-allowed 
                         transition-all duration-300
                         rounded-xl border-2 
                         ${unlockedLessons.includes(lesson.id)
                  ? `${lesson.borderColor} bg-gradient-to-br from-white to-${lesson.bgColor}/40 hover:shadow-md hover:-translate-y-1 hover:border-opacity-80`
                  : 'border-gray-200/60 bg-gray-50/80'}
                         ${currentLesson === lesson.id ? `ring-2 ring-blue-400 ring-offset-2 scale-[1.02] shadow-lg` : ''}`}
            >
              {/* Card Content */}
              <div className="flex flex-col items-center justify-center h-full w-full p-4 space-y-3">
                {/* Icon Section */}
                <div className="relative">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-200 drop-shadow-sm">
                    {unlockedLessons.includes(lesson.id) ? lesson.icon : '🔒'}
                  </div>
                  {currentLesson === lesson.id && unlockedLessons.includes(lesson.id) && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse shadow-lg" />
                  )}
                </div>

                {/* Title & Description Section */}
                <div className="text-center flex-1">
                  <h3 className={`text-sm font-semibold leading-tight px-2 min-h-[2.5rem] flex items-center justify-center ${styles.lineClamp2} mb-2`}>
                    {lesson.title}
                  </h3>
                  {unlockedLessons.includes(lesson.id) && lesson.concepts && (
                    <div className="flex flex-wrap justify-center gap-1 mb-2">
                      {lesson.concepts.slice(0, 2).map((concept, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-white/60 rounded-full text-gray-700 border border-gray-200"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Difficulty Badge */}
                <div className="mt-auto">
                  {unlockedLessons.includes(lesson.id) && (
                    <Badge
                      variant="secondary"
                      className={`text-xs px-3 py-1 font-medium ${getDifficultyColor(lesson.difficulty)} 
                                 border-0 shadow-sm`}
                    >
                      {lesson.difficulty}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Lock Overlay */}
              {!unlockedLessons.includes(lesson.id) && (
                <div className={`${styles.lockOverlay} absolute inset-0 rounded-xl flex flex-col items-center justify-center group`}>
                  <div className="text-2xl mb-2">🔒</div>
                  <span className="text-xs text-gray-600 font-medium text-center">Terkunci</span>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity z-30 whitespace-nowrap shadow-lg">
                    Selesaikan pelajaran sebelumnya
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                  </div>
                </div>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Konten Pelajaran */}
        <TabsContent value="lesson1" className={`${styles.tabContent} space-y-6`}>
          <Lesson1Dictionary onComplete={() => unlockNextLesson('lesson1')} />
        </TabsContent>

        <TabsContent value="lesson2" className={`${styles.tabContent} space-y-6`}>
          <Lesson2Methods onComplete={() => unlockNextLesson('lesson2')} />
        </TabsContent>

        <TabsContent value="lesson3" className={`${styles.tabContent} space-y-6`}>
          <Lesson3NestedDict onComplete={() => unlockNextLesson('lesson3')} />
        </TabsContent>

        <TabsContent value="lesson4" className={`${styles.tabContent} space-y-6`}>
          <Lesson4Objects onComplete={() => unlockNextLesson('lesson4')} />
        </TabsContent>

        <TabsContent value="playground" className={`${styles.tabContent} space-y-6`}>
          <SpellCraftingPlayground />
        </TabsContent>
      </Tabs>

      {/* Learning Progress Dashboard */}
      <Card className={`${styles.progressCard} mt-8 bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 border border-blue-200 shadow-lg`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-xl text-white">📊</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Progress Pembelajaran Dictionary</h3>
                <p className="text-sm text-gray-600">Pantau kemajuan belajar Anda</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">
              {unlockedLessons.length} / {lessons.length} Modul Selesai
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6 overflow-hidden shadow-inner">
            <div
              className={`${getProgressWidthClass()} h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-700 ease-out relative`}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Module Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 border ${unlockedLessons.includes(lesson.id)
                    ? `${lesson.borderColor} ${lesson.bgColor} hover:shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400`
                    : 'border-gray-200 bg-gray-50/80 cursor-not-allowed opacity-60'
                  } ${currentLesson === lesson.id ? 'ring-2 ring-blue-400 ring-offset-2 shadow-md' : ''}`}
                onClick={() => unlockedLessons.includes(lesson.id) && handleLessonChange(lesson.id)}
                onKeyDown={(e) => handleKeyDown(e, lesson.id)}
                tabIndex={unlockedLessons.includes(lesson.id) ? 0 : -1}
                role="button"
                aria-label={`Pilih ${lesson.title}${!unlockedLessons.includes(lesson.id) ? ' (Terkunci)' : ''}`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${unlockedLessons.includes(lesson.id)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-gray-300 text-gray-500'
                    }`}>
                    {unlockedLessons.includes(lesson.id) ? lesson.icon : '🔒'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${unlockedLessons.includes(lesson.id) ? 'text-gray-800' : 'text-gray-400'
                    }`}>
                    {lesson.title}
                  </div>
                  <div className={`text-xs ${unlockedLessons.includes(lesson.id) ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                    {lesson.difficulty}
                  </div>
                </div>
                {currentLesson === lesson.id && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Achievement Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{progressPercentage}%</div>
                <div className="text-xs text-gray-600">Completion</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3 border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">{unlockedLessons.length}</div>
                <div className="text-xs text-gray-600">Modules Done</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3 border border-indigo-200">
                <div className="text-2xl font-bold text-indigo-600">{lessons.length - unlockedLessons.length}</div>
                <div className="text-xs text-gray-600">Remaining</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  {unlockedLessons.length >= lessons.length ? '🏆' : '⭐'}
                </div>
                <div className="text-xs text-gray-600">Status</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
