"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Trophy,
  Star,
  Zap,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Lightbulb,
  ListOrdered,
  ArrowUpDown,
  Link2,
  Award,
} from 'lucide-react';

// --------------- Data Types ---------------

interface ChallengeOption {
  id: string;
  label: string;
}

interface ChallengeQuestion {
  prompt: string;
  code?: string;
  options: ChallengeOption[];
  correctId: string;
  explanation: string;
  hint: string;
}

interface ChallengeDefinition {
  id: string;
  title: string;
  description: string;
  difficulty: 'Mudah' | 'Sedang';
  icon: React.ReactNode;
  questions: ChallengeQuestion[];
}

interface PlaygroundProps {
  onComplete?: () => void;
  isCompleted?: boolean;
}

// --------------- Challenge Data ---------------

const challengeData: ChallengeDefinition[] = [
  {
    id: 'list-comprehension',
    title: 'Susun List Comprehension',
    description: 'Pilih list comprehension yang menghasilkan output yang benar',
    difficulty: 'Mudah',
    icon: <Lightbulb className="w-6 h-6" />,
    questions: [
      {
        prompt: 'Manakah list comprehension yang menghasilkan:',
        code: '[2, 4, 6, 8, 10]',
        options: [
          { id: 'a', label: '[x*2 for x in range(1, 6)]' },
          { id: 'b', label: '[x for x in range(2, 11)]' },
          { id: 'c', label: '[x+2 for x in range(5)]' },
          { id: 'd', label: '[x*2 for x in range(5)]' },
        ],
        correctId: 'a',
        explanation: 'range(1,6) menghasilkan 1,2,3,4,5. Dikalikan 2 menghasilkan 2,4,6,8,10.',
        hint: 'Perhatikan nilai awal dan akhir dari range().',
      },
      {
        prompt: 'Manakah list comprehension yang menghasilkan:',
        code: '[1, 4, 9, 16, 25]',
        options: [
          { id: 'a', label: '[x**2 for x in range(1, 6)]' },
          { id: 'b', label: '[x*x for x in range(5)]' },
          { id: 'c', label: '[x**2 for x in range(6)]' },
          { id: 'd', label: '[x*2 for x in range(1, 6)]' },
        ],
        correctId: 'a',
        explanation: 'range(1,6) → 1,2,3,4,5. Dipangkatkan 2 → 1,4,9,16,25.',
        hint: 'Pikirkan operasi pangkat (**) dan range yang dimulai dari 1.',
      },
      {
        prompt: 'Manakah list comprehension yang menghasilkan bilangan ganjil:',
        code: '[1, 3, 5, 7, 9]',
        options: [
          { id: 'a', label: '[x for x in range(10) if x % 2 == 0]' },
          { id: 'b', label: '[x for x in range(1, 10, 2)]' },
          { id: 'c', label: '[x*2+1 for x in range(5)]' },
          { id: 'd', label: '[x for x in range(1, 10) if x % 2 != 0]' },
        ],
        correctId: 'b',
        explanation: 'range(1, 10, 2) menghasilkan 1,3,5,7,9 — langkah 2 mulai dari 1.',
        hint: 'Parameter ketiga range() adalah langkah (step).',
      },
    ],
  },
  {
    id: 'predict-output',
    title: 'Prediksi Output',
    description: 'Tebak hasil eksekusi kode Python nested list',
    difficulty: 'Mudah',
    icon: <ListOrdered className="w-6 h-6" />,
    questions: [
      {
        prompt: 'Apa output dari kode berikut?',
        code: 'matrix = [[1,2],[3,4],[5,6]]\nprint(matrix[1][0])',
        options: [
          { id: 'a', label: '1' },
          { id: 'b', label: '3' },
          { id: 'c', label: '2' },
          { id: 'd', label: '4' },
        ],
        correctId: 'b',
        explanation: 'matrix[1] → [3,4], lalu [0] mengambil elemen pertama → 3.',
        hint: 'Indeks dimulai dari 0. matrix[1] adalah baris kedua.',
      },
      {
        prompt: 'Apa output dari kode berikut?',
        code: 'data = [[x*y for x in range(3)] for y in range(3)]\nprint(data[2])',
        options: [
          { id: 'a', label: '[0, 1, 2]' },
          { id: 'b', label: '[0, 2, 4]' },
          { id: 'c', label: '[2, 4, 6]' },
          { id: 'd', label: '[0, 3, 6]' },
        ],
        correctId: 'b',
        explanation: 'Saat y=2: [0*2, 1*2, 2*2] = [0, 2, 4].',
        hint: 'Hitung nilai x*y ketika y=2 untuk setiap x di range(3).',
      },
      {
        prompt: 'Apa output dari kode berikut?',
        code: 'nums = [10, 20, 30, 40, 50]\nprint(nums[1:4])',
        options: [
          { id: 'a', label: '[10, 20, 30]' },
          { id: 'b', label: '[20, 30, 40]' },
          { id: 'c', label: '[20, 30, 40, 50]' },
          { id: 'd', label: '[10, 20, 30, 40]' },
        ],
        correctId: 'b',
        explanation: 'Slicing [1:4] mengambil indeks 1,2,3 → [20, 30, 40].',
        hint: 'Slicing [a:b] mengambil dari indeks a sampai b-1.',
      },
      {
        prompt: 'Apa output dari kode berikut?',
        code: 'a, *b, c = [1, 2, 3, 4, 5]\nprint(b)',
        options: [
          { id: 'a', label: '[2, 3, 4]' },
          { id: 'b', label: '[1, 2, 3]' },
          { id: 'c', label: '[2, 3]' },
          { id: 'd', label: '[3, 4, 5]' },
        ],
        correctId: 'a',
        explanation: 'a=1, c=5, dan *b menangkap sisanya → [2, 3, 4].',
        hint: 'Operator * menangkap semua elemen "sisa" di tengah.',
      },
    ],
  },
  {
    id: 'sorting-challenge',
    title: 'Tantangan Sorting (Pengurutan)',
    description: 'Urutkan data siswa dengan ekspresi sorted() yang tepat',
    difficulty: 'Sedang',
    icon: <ArrowUpDown className="w-6 h-6" />,
    questions: [
      {
        prompt:
          'Diberikan data siswa berikut, pilih ekspresi yang mengurutkan berdasarkan nilai dari tertinggi ke terendah:',
        code: 'siswa = [\n  {"nama": "Budi", "nilai": 85},\n  {"nama": "Ani", "nilai": 92},\n  {"nama": "Citra", "nilai": 78},\n  {"nama": "Dedi", "nilai": 95}\n]',
        options: [
          { id: 'a', label: 'sorted(siswa, key=lambda s: s["nilai"], reverse=True)' },
          { id: 'b', label: 'sorted(siswa, key=lambda s: s["nilai"])' },
          { id: 'c', label: 'siswa.sort(key=lambda s: s["nama"], reverse=True)' },
          { id: 'd', label: 'sorted(siswa, reverse=True)' },
        ],
        correctId: 'a',
        explanation:
          'key=lambda s: s["nilai"] mengambil nilai sebagai kunci, reverse=True mengurutkan descending. Hasil: Dedi(95), Ani(92), Budi(85), Citra(78).',
        hint: 'Gunakan parameter key untuk menentukan field, dan reverse untuk urutan.',
      },
      {
        prompt: 'Bagaimana mengurutkan list string berdasarkan panjang kata (terpendek dulu)?',
        code: 'kata = ["python", "go", "javascript", "c", "ruby"]',
        options: [
          { id: 'a', label: 'sorted(kata)' },
          { id: 'b', label: 'sorted(kata, key=len)' },
          { id: 'c', label: 'sorted(kata, key=len, reverse=True)' },
          { id: 'd', label: 'sorted(kata, key=lambda x: x[0])' },
        ],
        correctId: 'b',
        explanation: 'key=len mengurutkan berdasarkan panjang string. Hasil: ["c", "go", "ruby", "python", "javascript"].',
        hint: 'Fungsi len() mengembalikan panjang string.',
      },
      {
        prompt: 'Bagaimana memfilter siswa yang nilainya ≥ 80 lalu mengurutkan berdasarkan nama (A-Z)?',
        code: 'siswa = [\n  {"nama": "Budi", "nilai": 85},\n  {"nama": "Ani", "nilai": 92},\n  {"nama": "Citra", "nilai": 78},\n  {"nama": "Dedi", "nilai": 95}\n]',
        options: [
          { id: 'a', label: 'sorted([s for s in siswa if s["nilai"] >= 80], key=lambda s: s["nama"])' },
          { id: 'b', label: 'sorted(siswa, key=lambda s: s["nama"])' },
          { id: 'c', label: '[s for s in sorted(siswa) if s["nilai"] >= 80]' },
          { id: 'd', label: 'filter(lambda s: s["nilai"] >= 80, siswa)' },
        ],
        correctId: 'a',
        explanation:
          'Pertama filter dengan comprehension (nilai ≥ 80), lalu sorted berdasarkan nama. Hasil: Ani(92), Budi(85), Dedi(95).',
        hint: 'Gabungkan list comprehension untuk filter dan sorted() untuk mengurutkan.',
      },
    ],
  },
  {
    id: 'zip-enumerate',
    title: 'Zip & Enumerate',
    description: 'Gabungkan dan beri nomor urut pada list',
    difficulty: 'Sedang',
    icon: <Link2 className="w-6 h-6" />,
    questions: [
      {
        prompt: 'Diberikan dua list berikut, bagaimana menggabungkannya menjadi pasangan?',
        code: 'nama = ["Ali", "Budi", "Citra"]\nnilai = [78, 85, 92]',
        options: [
          { id: 'a', label: 'list(zip(nama, nilai))' },
          { id: 'b', label: 'nama + nilai' },
          { id: 'c', label: '[nama, nilai]' },
          { id: 'd', label: 'enumerate(nama, nilai)' },
        ],
        correctId: 'a',
        explanation:
          'zip() menggabungkan elemen dari kedua list menjadi tuple pasangan: [("Ali",78), ("Budi",85), ("Citra",92)].',
        hint: 'zip() menggabungkan elemen pada posisi yang sama dari dua list.',
      },
      {
        prompt:
          'Setelah menggabungkan dengan zip, bagaimana menambahkan nomor urut mulai dari 1?',
        code: 'nama = ["Ali", "Budi", "Citra"]\nnilai = [78, 85, 92]\npasangan = zip(nama, nilai)',
        options: [
          { id: 'a', label: 'list(enumerate(pasangan, 1))' },
          { id: 'b', label: 'list(enumerate(pasangan))' },
          { id: 'c', label: 'list(zip(range(1,4), pasangan))' },
          { id: 'd', label: '[i for i in pasangan]' },
        ],
        correctId: 'a',
        explanation:
          'enumerate(iterable, 1) menambahkan nomor urut mulai dari 1. Hasil: [(1,("Ali",78)), (2,("Budi",85)), (3,("Citra",92))].',
        hint: 'Parameter kedua enumerate() menentukan nomor awal.',
      },
      {
        prompt: 'Apa output dari kode berikut?',
        code: 'buah = ["apel", "mangga", "jeruk"]\nfor i, b in enumerate(buah):\n    print(f"{i}: {b}")',
        options: [
          { id: 'a', label: '1: apel\\n2: mangga\\n3: jeruk' },
          { id: 'b', label: '0: apel\\n1: mangga\\n2: jeruk' },
          { id: 'c', label: 'apel: 0\\nmangga: 1\\njeruk: 2' },
          { id: 'd', label: '0 apel\\n1 mangga\\n2 jeruk' },
        ],
        correctId: 'b',
        explanation:
          'enumerate() default mulai dari 0. f-string format "{i}: {b}" menghasilkan "0: apel", dst.',
        hint: 'Secara default, enumerate() mulai dari indeks 0.',
      },
    ],
  },
];

// --------------- Component ---------------

export function MagicalPlayground({ onComplete, isCompleted }: PlaygroundProps) {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  // questionIndex per challenge
  const [questionIdx, setQuestionIdx] = useState<Record<string, number>>({});
  // answer state per question
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const completedCount = completed.size;

  const handleComplete = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // Trigger onComplete when 3/4 challenges done
  useEffect(() => {
    if (completedCount >= 3 && onComplete && !isCompleted) {
      onComplete();
    }
  }, [completedCount, onComplete, isCompleted]);

  const currentChallenge = challengeData.find((c) => c.id === activeChallenge);
  const currentQIdx = activeChallenge ? questionIdx[activeChallenge] ?? 0 : 0;
  const currentQuestion = currentChallenge?.questions[currentQIdx];
  const totalQuestions = currentChallenge?.questions.length ?? 0;

  const resetQuestionState = () => {
    setSelectedAnswer(null);
    setAnswerStatus('idle');
  };

  const handleSelectAnswer = (optionId: string) => {
    if (answerStatus !== 'idle') return;
    setSelectedAnswer(optionId);
    if (optionId === currentQuestion?.correctId) {
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('wrong');
    }
  };

  const handleNext = () => {
    if (!activeChallenge || !currentChallenge) return;
    const nextIdx = currentQIdx + 1;
    if (nextIdx >= totalQuestions) {
      handleComplete(activeChallenge);
      setActiveChallenge(null);
    } else {
      setQuestionIdx((prev) => ({ ...prev, [activeChallenge]: nextIdx }));
    }
    resetQuestionState();
  };

  const handleRetry = () => {
    resetQuestionState();
  };

  const openChallenge = (id: string) => {
    setActiveChallenge(id);
    if (!(id in questionIdx)) {
      setQuestionIdx((prev) => ({ ...prev, [id]: 0 }));
    }
    resetQuestionState();
  };

  const getDifficultyColor = (d: string) =>
    d === 'Mudah'
      ? 'bg-green-100 text-green-700 border-green-300'
      : 'bg-amber-100 text-amber-700 border-amber-300';

  // --------------- Active Challenge View ---------------
  if (activeChallenge && currentChallenge && currentQuestion) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-white border-purple-200 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                  {currentChallenge.icon}
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-800">{currentChallenge.title}</CardTitle>
                  <p className="text-sm text-purple-600">
                    Soal {currentQIdx + 1} dari {totalQuestions}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setActiveChallenge(null);
                  resetQuestionState();
                }}
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
              </Button>
            </div>
            {/* Progress bar */}
            <div className="mt-3 w-full bg-purple-100 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQIdx + (answerStatus === 'correct' ? 1 : 0)) / totalQuestions) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </CardHeader>
        </Card>

        {/* Question */}
        <motion.div
          key={`${activeChallenge}-${currentQIdx}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-white border-purple-200 shadow-lg">
            <CardContent className="p-6 space-y-5">
              <p className="text-gray-800 font-semibold text-lg">{currentQuestion.prompt}</p>

              {currentQuestion.code && (
                <pre className="bg-gray-900 text-green-400 rounded-lg p-4 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
                  {currentQuestion.code}
                </pre>
              )}

              <div className="grid gap-3">
                {currentQuestion.options.map((opt) => {
                  let optClass =
                    'border-gray-200 hover:border-purple-400 hover:bg-purple-50 cursor-pointer';
                  if (selectedAnswer) {
                    if (opt.id === currentQuestion.correctId) {
                      optClass = 'border-green-400 bg-green-50';
                    } else if (opt.id === selectedAnswer && answerStatus === 'wrong') {
                      optClass = 'border-red-400 bg-red-50';
                    } else {
                      optClass = 'border-gray-200 opacity-60';
                    }
                  }
                  return (
                    <motion.button
                      key={opt.id}
                      whileHover={answerStatus === 'idle' ? { scale: 1.01 } : {}}
                      whileTap={answerStatus === 'idle' ? { scale: 0.99 } : {}}
                      onClick={() => handleSelectAnswer(opt.id)}
                      disabled={answerStatus !== 'idle'}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${optClass}`}
                    >
                      <code className="text-sm text-gray-800">{opt.label}</code>
                    </motion.button>
                  );
                })}
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {answerStatus === 'correct' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-green-50 border border-green-300 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                      <CheckCircle2 className="w-5 h-5" /> Benar! 🎉
                    </div>
                    <p className="text-green-600 text-sm">{currentQuestion.explanation}</p>
                    <Button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mt-2"
                    >
                      {currentQIdx + 1 < totalQuestions ? 'Soal Berikutnya →' : 'Selesai! 🏆'}
                    </Button>
                  </motion.div>
                )}
                {answerStatus === 'wrong' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-50 border border-red-300 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-red-700 font-semibold">
                      <XCircle className="w-5 h-5" /> Belum tepat
                    </div>
                    <p className="text-red-600 text-sm">
                      💡 <strong>Petunjuk:</strong> {currentQuestion.hint}
                    </p>
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 mt-2"
                    >
                      Coba Lagi
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // --------------- Main Grid View ---------------
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Target className="w-7 h-7 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-800">🎮 Playground Magis</h2>
            <p className="text-purple-600 text-sm">Uji pemahamanmu tentang list Python lanjutan</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-1.5 text-amber-600">
            <Trophy className="w-4 h-4" />
            <span>{completedCount}/{challengeData.length} Selesai</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-600">
            <Star className="w-4 h-4" />
            <span>{completedCount >= 3 ? 'Master' : completedCount >= 1 ? 'Pelajar' : 'Pemula'}</span>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-1.5 text-green-600">
              <Zap className="w-4 h-4" />
              <span>Playground Tuntas!</span>
            </div>
          )}
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {challengeData.map((ch, idx) => {
          const isDone = completed.has(ch.id);
          return (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`h-full cursor-pointer transition-all shadow-lg ${
                  isDone
                    ? 'bg-green-50 border-green-300'
                    : 'bg-white border-purple-200 hover:border-purple-400'
                }`}
                onClick={() => openChallenge(ch.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-lg flex items-center justify-center ${
                          isDone ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-6 h-6" /> : ch.icon}
                      </div>
                      <div>
                        <CardTitle className="text-base text-gray-800">{ch.title}</CardTitle>
                        <p className="text-xs text-gray-500 mt-0.5">{ch.description}</p>
                      </div>
                    </div>
                    <Badge className={`text-xs border ${getDifficultyColor(ch.difficulty)}`}>
                      {ch.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{ch.questions.length} soal</span>
                    {isDone ? (
                      <Badge className="bg-green-100 text-green-700 border-green-300 text-xs">✅ Selesai</Badge>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs h-8"
                      >
                        <Target className="w-3.5 h-3.5 mr-1" /> Mulai
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Achievements Section */}
      {completedCount > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-500" /> Pencapaian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {challengeData.map((ch) => {
                  const isDone = completed.has(ch.id);
                  return (
                    <div
                      key={ch.id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                        isDone
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : <span className="w-4 h-4 rounded-full border-2 border-gray-300 inline-block" />}
                      <span className="font-medium">{ch.title}</span>
                    </div>
                  );
                })}
              </div>
              {completedCount >= 3 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-sm text-purple-600 font-semibold"
                >
                  🏆 Selamat! Kamu telah menyelesaikan cukup tantangan untuk menguasai materi ini!
                </motion.p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
