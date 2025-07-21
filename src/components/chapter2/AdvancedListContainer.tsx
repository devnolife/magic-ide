"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Sparkles,
  GitBranch,
  BookOpen,
  Target,
  Trophy,
  Clock,
  CheckCircle,
  PlayCircle,
  Zap,
  Brain
} from 'lucide-react';

// Import lesson components
import { Lesson1Comprehension } from './Lesson1Comprehension';
import { Lesson2NestedLists } from './Lesson2NestedLists';
import { Lesson3ListMethods } from './Lesson3ListMethods';
import { Lesson4ListTricks } from './Lesson4ListTricks';
import { MagicalPlayground } from './MagicalPlayground';

interface LessonComponentProps {
  onComplete: () => void;
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ComponentType<LessonComponentProps>;
  duration: string;
  difficulty: 'intermediate' | 'advanced' | 'master';
  completed: boolean;
  magicalPower: string;
}

const lessons: LessonData[] = [
  {
    id: 'comprehension',
    title: 'Laboratorium Generator Mantra',
    description: 'Kuasai seni kuno list comprehensions dan pembuatan mantra',
    icon: <Sparkles className="w-6 h-6" />,
    component: Lesson1Comprehension,
    duration: '15 menit',
    difficulty: 'intermediate',
    completed: false,
    magicalPower: 'Sihir Transformasi'
  },
  {
    id: 'nested-lists',
    title: 'Akademi Portal Dimensi',
    description: 'Navigasi melalui dimensi nested dan alam matriks',
    icon: <GitBranch className="w-6 h-6" />,
    component: Lesson2NestedLists,
    duration: '12 menit',
    difficulty: 'intermediate',
    completed: false,
    magicalPower: 'Kontrol Dimensi'
  },
  {
    id: 'list-methods',
    title: 'Arsenal Kitab Mantra Lanjutan',
    description: 'Buka kunci metode-metode kuat dari kitab kuno',
    icon: <BookOpen className="w-6 h-6" />,
    component: Lesson3ListMethods,
    duration: '10 menit',
    difficulty: 'advanced',
    completed: false,
    magicalPower: 'Penguasaan Metode'
  },
  {
    id: 'list-tricks',
    title: 'Teknik Grandmaster',
    description: 'Pelajari teknik rahasia para penyihir master',
    icon: <Brain className="w-6 h-6" />,
    component: Lesson4ListTricks,
    duration: '18 menit',
    difficulty: 'master',
    completed: false,
    magicalPower: 'Kebijaksanaan Kuno'
  }
];

export function AdvancedListContainer() {
  const [activeLesson, setActiveLesson] = useState<string>('comprehension');
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [showPlayground, setShowPlayground] = useState(false);

  const handleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const overallProgress = (completedLessons.size / lessons.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'intermediate': return 'bg-blue-500';
      case 'advanced': return 'bg-purple-500';
      case 'master': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'intermediate': return '🔮 Menengah';
      case 'advanced': return '⚡ Lanjutan';
      case 'master': return '👑 Master';
      default: return difficulty;
    }
  };

  if (showPlayground) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white/95 border-purple-200 shadow-2xl backdrop-blur-sm">
          <CardHeader className="border-b border-purple-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-gray-800">🎮 Taman Bermain Sihir Master</CardTitle>
                  <p className="text-purple-600 text-sm">Sandbox manipulasi list lanjutan</p>
                </div>
              </div>
              <Button
                onClick={() => setShowPlayground(false)}
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                Kembali ke Akademi
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <MagicalPlayground />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Wizard Academy Header */}
      <Card className="bg-white/95 border-yellow-200 shadow-2xl backdrop-blur-sm">
        <CardHeader>
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-2xl">🧙‍♂️</span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Akademi List Penyihir Master</h2>
                <p className="text-yellow-600">Pythia Master menanti pelatihan lanjutan Anda</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2 text-purple-600">
                <Trophy className="w-4 h-4" />
                <span>{completedLessons.size}/{lessons.length} Dikuasai</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Clock className="w-4 h-4" />
                <span>~55 menit total</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <Zap className="w-4 h-4" />
                <span>Level Lanjutan</span>
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm text-purple-600 mb-2">
                <span>Progress Akademi</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-3 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-yellow-400 [&>div]:to-orange-500" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lesson Selector */}
        <div className="lg:col-span-1">
          <Card className="bg-white/95 border-purple-200 shadow-xl backdrop-blur-sm h-fit">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Kurikulum Kuno
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {lessons.map((lesson) => (
                <motion.div
                  key={lesson.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={activeLesson === lesson.id ? "default" : "outline"}
                    className={`w-full justify-start h-auto p-4 ${activeLesson === lesson.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 text-white'
                      : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    onClick={() => setActiveLesson(lesson.id)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className={`p-2 rounded-lg ${completedLessons.has(lesson.id)
                        ? 'bg-green-500/20 text-green-600'
                        : activeLesson === lesson.id
                          ? 'bg-white/20 text-white'
                          : 'bg-purple-500/20 text-purple-600'
                        }`}>
                        {completedLessons.has(lesson.id) ? <CheckCircle className="w-5 h-5" /> : lesson.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-sm mb-1">{lesson.title}</div>
                        <div className="text-xs opacity-80 mb-2">{lesson.description}</div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={`text-xs ${getDifficultyColor(lesson.difficulty)} text-white border-0`}>
                            {getDifficultyBadge(lesson.difficulty)}
                          </Badge>
                          <span className="text-xs opacity-60">{lesson.duration}</span>
                        </div>
                        <div className={`text-xs mt-1 ${activeLesson === lesson.id ? 'text-purple-200' : 'text-purple-600'}`}>
                          ✨ {lesson.magicalPower}
                        </div>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-3 border-t border-gray-200"
              >
                <Button
                  onClick={() => setShowPlayground(true)}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white border-0"
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Masuk Taman Bermain Sihir
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Content */}
        <div className="lg:col-span-2">
          <Card className="bg-white/95 border-purple-200 shadow-xl backdrop-blur-sm">
            <CardContent className="p-6">
              {lessons.map((lesson) => (
                activeLesson === lesson.id && (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <lesson.component onComplete={() => handleLessonComplete(lesson.id)} />
                  </motion.div>
                )
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
