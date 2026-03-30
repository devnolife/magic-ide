"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, BookOpen, Trophy, Target, Lock, Loader2 } from 'lucide-react';
import { BackToDashboard } from '@/components/dashboard/BackToDashboard';
import LessonContainer from '@/components/chapter0/LessonContainer';
import Lesson1Programming from '@/components/chapter0/Lesson1Programming';
import Lesson2Variables from '@/components/chapter0/Lesson2Variables';
import Lesson3DataTypes from '@/components/chapter0/Lesson3DataTypes';
import Lesson4Operations from '@/components/chapter0/Lesson4Operations';
import Link from 'next/link';
import { toast } from 'sonner';

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

interface ChapterMeta {
  chapterId: string;
  lessons: { id: string; number: number; title: string }[];
}

export function Chapter0Page() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [challengesUnlocked, setChallengesUnlocked] = useState(false);
  const [chapterMeta, setChapterMeta] = useState<ChapterMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingLesson, setSavingLesson] = useState<number | null>(null);

  // Load chapter metadata (DB IDs) and existing progress
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('auth-token');

        // Fetch chapter metadata (chapterId + lesson IDs)
        const metaRes = await fetch('/api/chapters/0/lessons');
        if (metaRes.ok) {
          const meta = await metaRes.json();
          setChapterMeta(meta);
        }

        // Fetch user's saved progress
        if (token) {
          const progressRes = await fetch('/api/progress', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (progressRes.ok) {
            const data = await progressRes.json();
            const ch0Progress = (data.progress ?? []).find(
              (p: { chapterNumber: number }) => p.chapterNumber === 0
            );

            if (ch0Progress?.lessonProgress) {
              const completed = new Set<number>();
              for (const lp of ch0Progress.lessonProgress) {
                if (lp.status === 'COMPLETED') {
                  // Map DB lesson to frontend lesson number
                  const lesson = lp.lesson;
                  if (lesson?.number) {
                    completed.add(lesson.number);
                  }
                }
              }
              setCompletedLessons(completed);
              if (completed.size === lessons.length) {
                setChallengesUnlocked(true);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error loading chapter data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const currentLesson = lessons[currentLessonIndex];
  const progress = ((completedLessons.size) / lessons.length) * 100;

  // Check if challenges should be unlocked
  useEffect(() => {
    if (loading) return;
    const allCompleted = completedLessons.size === lessons.length;
    if (allCompleted && !challengesUnlocked) {
      setChallengesUnlocked(true);
      setTimeout(() => {
        toast.success("🎯 Tantangan Terbuka!", {
          description: "Selamat! Anda telah membuka tantangan interaktif. Uji kemampuan Anda sekarang!",
          duration: 5000,
        });
      }, 1000);
    }
  }, [completedLessons.size, challengesUnlocked, loading]);

  const handleLessonComplete = useCallback(async (lessonNumber: number) => {
    // Already completed — skip
    if (completedLessons.has(lessonNumber)) return;

    // Update local state immediately
    setCompletedLessons(prev => new Set([...prev, lessonNumber]));
    setSavingLesson(lessonNumber);

    // Save to database
    try {
      const token = localStorage.getItem('auth-token');
      if (!token || !chapterMeta) {
        setSavingLesson(null);
        return;
      }

      // Find the DB lesson ID for this lesson number
      const dbLesson = chapterMeta.lessons.find(l => l.number === lessonNumber);
      if (!dbLesson) {
        console.error('Lesson not found in DB for number:', lessonNumber);
        setSavingLesson(null);
        return;
      }

      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chapterId: chapterMeta.chapterId,
          lessonId: dbLesson.id,
          status: 'COMPLETED',
          timeSpent: 0,
        }),
      });

      if (res.ok) {
        toast.success(`✅ Pelajaran "${lessons.find(l => l.id === lessonNumber)?.title}" tersimpan!`, {
          duration: 2000,
        });
      } else {
        console.error('Failed to save lesson progress');
      }
    } catch (err) {
      console.error('Error saving lesson progress:', err);
    } finally {
      setSavingLesson(null);
    }
  }, [completedLessons, chapterMeta]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const CurrentLessonComponent = currentLesson.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-emerald-50 to-pink-50">
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
                          {savingLesson === lesson.id ? (
                            <Loader2 className="w-4 h-4 animate-spin ml-auto" />
                          ) : completedLessons.has(lesson.id) ? (
                            <Trophy className="w-4 h-4 text-yellow-500 ml-auto" />
                          ) : null}
                        </div>
                      </Button>
                    </motion.div>
                  ))}

                  {/* Challenges Menu - Unlocked after all lessons completed */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-600">Tantangan</h3>
                      {completedLessons.size < lessons.length && (
                        <Badge variant="outline" className="text-xs">
                          {completedLessons.size}/{lessons.length}
                        </Badge>
                      )}
                    </div>

                    {completedLessons.size === lessons.length ? (
                      <Link href="/chapter/0/challenge/1">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="relative"
                        >
                          {/* Sparkle effect */}
                          {challengesUnlocked && (
                            <>
                              <motion.div
                                className="absolute -top-1 -right-1 text-yellow-400"
                                animate={{
                                  scale: [0, 1, 0],
                                  rotate: [0, 180, 360],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  repeatDelay: 2,
                                }}
                              >
                                ✨
                              </motion.div>
                              <motion.div
                                className="absolute -bottom-1 -left-1 text-orange-400"
                                animate={{
                                  scale: [0, 1, 0],
                                  rotate: [360, 180, 0],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  repeatDelay: 2,
                                  delay: 0.5,
                                }}
                              >
                                ⭐
                              </motion.div>
                            </>
                          )}

                          <Button
                            variant="outline"
                            className="w-full justify-start p-4 h-auto border-2 border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 shadow-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <motion.div
                                className="text-2xl"
                                animate={{
                                  scale: [1, 1.1, 1],
                                  rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  repeatDelay: 3
                                }}
                              >
                                🎯
                              </motion.div>
                              <div className="text-left">
                                <div className="font-medium text-sm text-yellow-800">Uji Kemampuan</div>
                                <div className="text-xs text-yellow-600">Tantangan Interaktif</div>
                              </div>
                              <div className="ml-auto flex items-center space-x-1">
                                <span className="text-xs text-yellow-600 font-medium">BUKA</span>
                                <Target className="w-4 h-4 text-yellow-600" />
                              </div>
                            </div>
                          </Button>
                        </motion.div>
                      </Link>
                    ) : (
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="opacity-60"
                      >
                        <Button
                          variant="ghost"
                          disabled
                          className="w-full justify-start p-4 h-auto cursor-not-allowed border border-gray-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">🔒</div>
                            <div className="text-left flex-1">
                              <div className="font-medium text-sm text-gray-500">Uji Kemampuan</div>
                              <div className="text-xs text-gray-400">
                                Selesaikan {lessons.length - completedLessons.size} pelajaran lagi
                              </div>
                            </div>
                            <Lock className="w-4 h-4 text-gray-400" />
                          </div>
                        </Button>
                      </motion.div>
                    )}

                    {/* Progress indicator for challenges unlock */}
                    {completedLessons.size > 0 && completedLessons.size < lessons.length && (
                      <div className="mt-2 px-1">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Progress untuk membuka tantangan</span>
                          <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-1" />
                      </div>
                    )}
                  </div>
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
                      <p className="text-green-700 mb-4">
                        Anda telah menyelesaikan Chapter 0: Dasar-Dasar Pemrograman!
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link href="/chapter/0/challenge/1">
                          <Button variant="outline" size="lg" className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200">
                            <Target className="w-5 h-5 mr-2" />
                            Uji Kemampuan
                          </Button>
                        </Link>
                        <Link href="/chapter/1">
                          <Button size="lg">
                            Lanjut ke Chapter 1 →
                          </Button>
                        </Link>
                      </div>
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
