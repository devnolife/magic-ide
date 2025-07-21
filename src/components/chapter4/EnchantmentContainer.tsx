"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lesson1ForLoops } from './Lesson1ForLoops';
import { Lesson2WhileLoops } from './Lesson2WhileLoops';
import { Lesson3NestedLoops } from './Lesson3NestedLoops';
import { Lesson4Comprehensions } from './Lesson4Comprehensions';
import { IterationPlayground } from './IterationPlayground';

export function EnchantmentContainer() {
  const [currentLesson, setCurrentLesson] = useState('lesson1');
  const [unlockedLessons, setUnlockedLessons] = useState(['lesson1']);

  const lessons = [
    {
      id: 'lesson1',
      title: 'For Loop Incantations',
      description: 'Master the art of controlled repetition with for loops and ranges',
      icon: '🔁',
      difficulty: 'Apprentice',
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200'
    },
    {
      id: 'lesson2',
      title: 'While Circle Rituals',
      description: 'Learn conditional repetition and infinite circle management',
      icon: '⚡',
      difficulty: 'Adept',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'lesson3',
      title: 'Nested Circle Mastery',
      description: 'Explore multi-dimensional loops and complex iteration patterns',
      icon: '🌀',
      difficulty: 'Expert',
      color: 'from-fuchsia-500 to-fuchsia-600',
      bgColor: 'bg-fuchsia-50',
      borderColor: 'border-fuchsia-200'
    },
    {
      id: 'lesson4',
      title: 'Comprehension Sorcery',
      description: 'Master advanced list/dict comprehensions and generator magic',
      icon: '✨',
      difficulty: 'Master',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      id: 'playground',
      title: 'Iteration Playground',
      description: 'Free practice arena for all loop and iteration techniques',
      icon: '🎭',
      difficulty: 'Grandmaster',
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200'
    }
  ];

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
      case 'Apprentice': return 'bg-green-100 text-green-800';
      case 'Adept': return 'bg-blue-100 text-blue-800';
      case 'Expert': return 'bg-yellow-100 text-yellow-800';
      case 'Master': return 'bg-purple-100 text-purple-800';
      case 'Grandmaster': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Enchantment Academy Header */}
      <Card className="mb-8 bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 border-2 border-violet-200 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <span className="text-6xl">⭕</span>
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-violet-400 rounded-full animate-spin"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full animate-spin [animation-direction:reverse]"></div>
              <div className="absolute top-1 -left-4 w-2 h-2 bg-fuchsia-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Master Circula's Enchantment Academy
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
            Step into the sacred circles where loops and iterations become infinite sources of magical power.
            Each lesson unlocks deeper mysteries of repetitive enchantments and algorithmic sorcery.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Lesson Navigation */}
      <Tabs value={currentLesson} onValueChange={setCurrentLesson}>
        <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/80 backdrop-blur-sm border border-violet-200 shadow-lg">
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

        {/* Lesson Content */}
        <TabsContent value="lesson1" className="space-y-6">
          <Lesson1ForLoops onComplete={() => unlockNextLesson('lesson1')} />
        </TabsContent>

        <TabsContent value="lesson2" className="space-y-6">
          <Lesson2WhileLoops onComplete={() => unlockNextLesson('lesson2')} />
        </TabsContent>

        <TabsContent value="lesson3" className="space-y-6">
          <Lesson3NestedLoops onComplete={() => unlockNextLesson('lesson3')} />
        </TabsContent>

        <TabsContent value="lesson4" className="space-y-6">
          <Lesson4Comprehensions onComplete={() => unlockNextLesson('lesson4')} />
        </TabsContent>

        <TabsContent value="playground" className="space-y-6">
          <IterationPlayground onComplete={() => unlockNextLesson('playground')} />
        </TabsContent>
      </Tabs>

      {/* Progress Indicator */}
      <Card className="mt-8 bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Enchantment Progress</h3>
            <Badge variant="outline" className="bg-white">
              {unlockedLessons.length} / {lessons.length} Circles Mastered
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div className={`h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500 ease-out`} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${unlockedLessons.includes(lesson.id)
                  ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500'
                  : 'bg-gray-300'
                  }`} />
                <span className={`text-sm ${unlockedLessons.includes(lesson.id) ? 'text-gray-800' : 'text-gray-400'
                  }`}>
                  {lesson.title.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
