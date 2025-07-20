"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, BookOpen, Trophy } from 'lucide-react';
import { BackToDashboard } from '@/components/dashboard/BackToDashboard';
import LessonContainer from '@/components/chapter0/LessonContainer';
import Lesson1Programming from '@/components/chapter0/Lesson1Programming';
import Lesson2Variables from '@/components/chapter0/Lesson2Variables';
import Lesson3DataTypes from '@/components/chapter0/Lesson3DataTypes';
import Lesson4Operations from '@/components/chapter0/Lesson4Operations';

const lessons = [
  {
    id: 1,
    title: "Apa itu Pemrograman?",
    subtitle: "Robot Chef Adventure",
    description: "Belajar pemrograman dengan robot chef yang mengikuti instruksi memasak",
    icon: "🤖",
    component: Lesson1Programming
  },
  {
    id: 2,
    title: "Variabel & Memori",
    subtitle: "Magic Warehouse",
    description: "Memahami bagaimana komputer menyimpan data seperti gudang ajaib",
    icon: "📦",
    component: Lesson2Variables
  },
  {
    id: 3,
    title: "Tipe Data Python",
    subtitle: "Data Type Adventure Park",
    description: "Jelajahi taman bermain dengan berbagai zona tipe data",
    icon: "🎡",
    component: Lesson3DataTypes
  },
  {
    id: 4,
    title: "Operasi Dasar",
    subtitle: "Operation Factory",
    description: "Pabrik operasi matematika dan manipulasi teks",
    icon: "🏭",
    component: Lesson4Operations
  }
];

export default function Chapter0Page() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

  const currentLesson = lessons[currentLessonIndex];
  const progress = ((completedLessons.size) / lessons.length) * 100;

  const handleLessonComplete = (lessonId: number) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const goToLesson = (index: number) => {
    setCurrentLessonIndex(index);
  };

  const CurrentLessonComponent = currentLesson.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <BackToDashboard />
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chapter 0</h1>
                <p className="text-sm text-gray-600">Dasar-Dasar Pemrograman</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">{completedLessons.size}/{lessons.length}</span>
              </div>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Pelajaran</h2>
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <motion.div
                      key={lesson.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant={index === currentLessonIndex ? "default" : "ghost"}
                        className="w-full justify-start p-4 h-auto"
                        onClick={() => goToLesson(index)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{lesson.icon}</div>
                          <div className="text-left">
                            <div className="font-medium text-sm">{lesson.title}</div>
                            <div className="text-xs opacity-70">{lesson.subtitle}</div>
                          </div>
                          {completedLessons.has(lesson.id) && (
                            <Trophy className="w-4 h-4 text-yellow-500 ml-auto" />
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <LessonContainer>
              {/* Lesson Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <Badge className="text-lg px-4 py-2 mb-4">
                  <span className="text-2xl mr-2">{currentLesson.icon}</span>
                  Pelajaran {currentLesson.id}
                </Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentLesson.title}
                </h1>
                <h2 className="text-xl text-blue-600 font-semibold mb-3">
                  {currentLesson.subtitle}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {currentLesson.description}
                </p>
              </motion.div>

              {/* Lesson Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLessonIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <CurrentLessonComponent
                    onComplete={() => handleLessonComplete(currentLesson.id)}
                    isCompleted={completedLessons.has(currentLesson.id)}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t">
                <Button
                  variant="outline"
                  onClick={goToPreviousLesson}
                  disabled={currentLessonIndex === 0}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </Button>

                <div className="flex items-center space-x-2">
                  {lessons.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${index === currentLessonIndex
                        ? 'bg-blue-600'
                        : index < currentLessonIndex
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                        }`}
                    />
                  ))}
                </div>

                <Button
                  onClick={goToNextLesson}
                  disabled={currentLessonIndex === lessons.length - 1}
                  className="flex items-center space-x-2"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Completion Message */}
              {completedLessons.size === lessons.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-8 text-center"
                >
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-6">
                      <div className="text-6xl mb-4">🎉</div>
                      <h3 className="text-2xl font-bold text-green-800 mb-2">
                        Selamat!
                      </h3>
                      <p className="text-green-700">
                        Anda telah menyelesaikan Chapter 0: Dasar-Dasar Pemrograman!
                      </p>
                      <Button className="mt-4" size="lg">
                        Lanjut ke Chapter 1 →
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </LessonContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
