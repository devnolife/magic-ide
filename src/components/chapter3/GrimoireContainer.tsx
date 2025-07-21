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

export function GrimoireContainer() {
  const [currentLesson, setCurrentLesson] = useState('lesson1');
  const [unlockedLessons, setUnlockedLessons] = useState(['lesson1']);

  const lessons = [
    {
      id: 'lesson1',
      title: 'Spell Ingredient Catalog',
      description: 'Master the ancient art of Dictionary creation and basic key-value magic',
      icon: '🧪',
      difficulty: 'Apprentice',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'lesson2',
      title: 'Grimoire Management Spells',
      description: 'Learn advanced Dictionary methods and manipulation techniques',
      icon: '📜',
      difficulty: 'Adept',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    },
    {
      id: 'lesson3',
      title: 'Multi-Dimensional Spell Books',
      description: 'Explore nested dictionaries and complex data structures',
      icon: '🔮',
      difficulty: 'Expert',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      id: 'lesson4',
      title: 'Magical Creature Creation',
      description: 'Discover object-oriented programming with magical entities',
      icon: '🐉',
      difficulty: 'Master',
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      id: 'playground',
      title: 'Spell Crafting Playground',
      description: 'Free practice arena for advanced dictionary and object magic',
      icon: '⚡',
      difficulty: 'Grandmaster',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
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
      {/* Magical Academy Header */}
      <Card className="mb-8 bg-gradient-to-r from-purple-50 via-indigo-50 to-amber-50 border-2 border-purple-200 shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <span className="text-6xl">📚</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-amber-400 rounded-full animate-ping"></div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">
            Master Libris's Grimoire Academy
          </CardTitle>
          <CardDescription className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to the ancient library where dictionaries come alive as magical catalogs and objects transform into mystical creatures.
            Each lesson unlocks deeper secrets of data organization and manipulation.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Lesson Navigation */}
      <Tabs value={currentLesson} onValueChange={setCurrentLesson}>
        <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/80 backdrop-blur-sm border border-purple-200 shadow-lg">
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
          <Lesson1Dictionary onComplete={() => unlockNextLesson('lesson1')} />
        </TabsContent>

        <TabsContent value="lesson2" className="space-y-6">
          <Lesson2Methods onComplete={() => unlockNextLesson('lesson2')} />
        </TabsContent>

        <TabsContent value="lesson3" className="space-y-6">
          <Lesson3NestedDict onComplete={() => unlockNextLesson('lesson3')} />
        </TabsContent>

        <TabsContent value="lesson4" className="space-y-6">
          <Lesson4Objects onComplete={() => unlockNextLesson('lesson4')} />
        </TabsContent>

        <TabsContent value="playground" className="space-y-6">
          <SpellCraftingPlayground />
        </TabsContent>
      </Tabs>

      {/* Progress Indicator */}
      <Card className="mt-8 bg-gradient-to-r from-purple-50 to-amber-50 border border-purple-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Academy Progress</h3>
            <Badge variant="outline" className="bg-white">
              {unlockedLessons.length} / {lessons.length} Grimoires Unlocked
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${(unlockedLessons.length / lessons.length) * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${unlockedLessons.includes(lesson.id)
                  ? 'bg-gradient-to-r from-purple-500 to-amber-500'
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
