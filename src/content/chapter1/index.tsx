"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle, Circle, PlayCircle } from 'lucide-react';

// Import lesson components
import Pelajaran1ApaItuPemrograman from './pelajaran1-apa-itu-pemrograman';
import Pelajaran2VariabelMemori from './pelajaran2-variabel-memori';
import Pelajaran3TipeData from './pelajaran3-tipe-data';
import Pelajaran4OperasiDasar from './pelajaran4-operasi-dasar';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  component: React.ComponentType<any>;
  completed: boolean;
}

interface Chapter1Props {
  onChapterComplete?: () => void;
}

export default function Chapter1({ onChapterComplete }: Chapter1Props) {
  const [currentLesson, setCurrentLesson] = useState<string>('overview');
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const lessons: Lesson[] = [
    {
      id: 'lesson1',
      title: 'Apa itu Pemrograman?',
      description: 'Memahami konsep dasar pemrograman dengan analogi kehidupan sehari-hari',
      duration: '15 menit',
      component: Pelajaran1ApaItuPemrograman,
      completed: completedLessons.has('lesson1')
    },
    {
      id: 'lesson2',
      title: 'Variabel dan Memori',
      description: 'Belajar cara komputer menyimpan dan mengorganisir data',
      duration: '20 menit',
      component: Pelajaran2VariabelMemori,
      completed: completedLessons.has('lesson2')
    },
    {
      id: 'lesson3',
      title: 'Tipe Data',
      description: 'Mengenal berbagai jenis data dalam Python dan karakteristiknya',
      duration: '25 menit',
      component: Pelajaran3TipeData,
      completed: completedLessons.has('lesson3')
    },
    {
      id: 'lesson4',
      title: 'Operasi Dasar',
      description: 'Melakukan operasi matematika dan manipulasi data',
      duration: '30 menit',
      component: Pelajaran4OperasiDasar,
      completed: completedLessons.has('lesson4')
    }
  ];

  const handleLessonComplete = (lessonId: string) => {
    const newCompleted = new Set(completedLessons);
    newCompleted.add(lessonId);
    setCompletedLessons(newCompleted);

    // Check if all lessons are completed
    if (newCompleted.size === lessons.length) {
      onChapterComplete?.();
    }
  };

  const calculateProgress = () => {
    return (completedLessons.size / lessons.length) * 100;
  };

  const getCurrentLessonComponent = () => {
    const lesson = lessons.find(l => l.id === currentLesson);
    if (lesson) {
      const LessonComponent = lesson.component;
      return <LessonComponent onComplete={() => handleLessonComplete(lesson.id)} />;
    }
    return null;
  };

  if (currentLesson !== 'overview') {
    return (
      <div className="max-w-7xl mx-auto p-6">
        {/* Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentLesson('overview')}
          >
            ← Kembali ke Overview
          </Button>
          <Badge className="text-lg px-4 py-2">
            Chapter 1: Dasar-Dasar Pemrograman
          </Badge>
        </div>

        {/* Lesson Content */}
        {getCurrentLessonComponent()}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Chapter Header */}
      <div className="text-center space-y-4">
        <Badge className="text-2xl px-6 py-3">
          <BookOpen className="w-6 h-6 mr-2" />
          Chapter 1: Memahami Dasar-Dasar Pemrograman
        </Badge>
        <h1 className="text-4xl font-bold">
          Fondasi Pemrograman Python
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Sebelum menulis kode, mari pahami konsep-konsep fundamental yang akan
          menjadi fondasi perjalanan belajar Python Anda.
        </p>
      </div>

      {/* Progress */}
      <Card className="border-blue-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Progress Pembelajaran</h3>
              <span className="text-sm text-muted-foreground">
                {completedLessons.size}/{lessons.length} pelajaran selesai
              </span>
            </div>
            <Progress value={calculateProgress()} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {calculateProgress() === 100
                ? "🎉 Selamat! Anda telah menyelesaikan semua pelajaran di Chapter 1"
                : `${Math.round(calculateProgress())}% selesai - Terus semangat!`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card className="border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-green-700">🎯 Tujuan Pembelajaran</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Setelah menyelesaikan chapter ini, Anda akan:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Memahami konsep dasar pemrograman dan cara berpikir seperti programmer</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Mengetahui cara komputer menyimpan dan mengorganisir data</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Mengenal berbagai tipe data Python dan karakteristiknya</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Mampu melakukan operasi dasar pada data</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Keterampilan yang Anda dapatkan:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <Badge className="bg-blue-100 text-blue-800 text-xs">Konseptual</Badge>
                  <span>Pemahaman logika pemrograman</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Badge className="bg-purple-100 text-purple-800 text-xs">Teknis</Badge>
                  <span>Pengelolaan variabel dan memori</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Badge className="bg-orange-100 text-orange-800 text-xs">Praktis</Badge>
                  <span>Operasi data fundamental</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Badge className="bg-green-100 text-green-800 text-xs">Analitis</Badge>
                  <span>Pemecahan masalah sistematis</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Daftar Pelajaran</h2>

        <div className="grid gap-6">
          {lessons.map((lesson, index) => (
            <Card
              key={lesson.id}
              className={`transition-all hover:shadow-lg ${lesson.completed
                ? 'border-green-200 bg-green-50'
                : 'border-gray-200 hover:border-blue-300'
                }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                      {lesson.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-blue-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold">{lesson.title}</h3>
                        <Badge variant="outline">{lesson.duration}</Badge>
                        {lesson.completed && (
                          <Badge className="bg-green-100 text-green-800">Selesai</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{lesson.description}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setCurrentLesson(lesson.id)}
                    className="ml-4"
                    variant={lesson.completed ? "outline" : "default"}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {lesson.completed ? 'Ulangi' : 'Mulai'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Chapter Summary */}
      <Card className="border-indigo-200">
        <CardHeader className="bg-indigo-50">
          <CardTitle className="text-indigo-700">📚 Ringkasan Chapter</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Chapter 1 membangun fondasi pemahaman tentang pemrograman tanpa memerlukan
              pengetahuan coding sebelumnya. Dengan pendekatan visual dan interaktif,
              Anda akan memahami konsep-konsep abstrak menjadi konkret.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">🎓 Metode Pembelajaran:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Analogi dengan kehidupan sehari-hari</li>
                  <li>• Visualisasi interaktif</li>
                  <li>• Demo animasi konsep</li>
                  <li>• Latihan hands-on</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">⏱️ Estimasi Waktu:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Total pembelajaran: ~90 menit</li>
                  <li>• Bisa diselesaikan bertahap</li>
                  <li>• Progress tersimpan otomatis</li>
                  <li>• Bisa diulang kapan saja</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      {calculateProgress() === 100 && (
        <Card className="border-gold-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="text-4xl">🎉</div>
              <h3 className="text-xl font-bold">Chapter 1 Selesai!</h3>
              <p className="text-muted-foreground">
                Anda telah menguasai dasar-dasar pemrograman.
                Siap melanjutkan ke Chapter 2: Python Lists?
              </p>
              <Link href="/chapter2">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600">
                  Lanjut ke Chapter 2 →
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
