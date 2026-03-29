'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Clock,
  FileQuestion,
  Trophy,
  Star,
  ArrowLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface QuizSummary {
  id: string;
  title: string;
  description: string;
  timeLimit: number | null;
  chapterTitle: string;
  questionCount: number;
  totalPoints: number;
  bestAttempt: {
    percentage: number;
    status: string;
  } | null;
}

function getStatusBadge(bestAttempt: QuizSummary['bestAttempt']) {
  if (!bestAttempt) {
    return (
      <Badge variant="outline" className="border-gray-300 text-gray-500">
        Belum Dikerjakan
      </Badge>
    );
  }
  if (bestAttempt.percentage >= 60) {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-300">
        Lulus
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-700 border-red-300">
      Tidak Lulus
    </Badge>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return `${hours} jam ${remainMins > 0 ? `${remainMins} menit` : ''}`;
  }
  return `${mins} menit`;
}

export default function QuizListPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.id as string;

  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const token = localStorage.getItem('auth-token');
        const res = await fetch(`/api/quizzes?chapterId=${chapterId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Gagal memuat daftar kuis');
        const data = await res.json();
        setQuizzes(Array.isArray(data) ? data : data.quizzes ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, [chapterId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mx-auto" />
          <p className="text-muted-foreground">Memuat daftar kuis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full bg-white/70 backdrop-blur-md border-white/20">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-red-600 font-medium">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button
          variant="ghost"
          onClick={() => router.push(`/chapter/${chapterId}`)}
          className="mb-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Chapter
        </Button>

        <div className="flex items-center gap-3 mb-1">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-600 text-white">
            <FileQuestion className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Kuis
            </h1>
            <p className="text-sm text-muted-foreground">
              Uji pemahaman kamu tentang materi chapter ini
            </p>
          </div>
        </div>
      </motion.div>

      <Separator />

      {quizzes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/70 backdrop-blur-md border-white/20">
            <CardContent className="py-12 text-center space-y-3">
              <FileQuestion className="h-12 w-12 text-gray-300 mx-auto" />
              <p className="text-muted-foreground">
                Belum ada kuis tersedia untuk chapter ini.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg font-semibold group-hover:text-emerald-600 transition-colors">
                        {quiz.title}
                      </CardTitle>
                      {quiz.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {quiz.description}
                        </p>
                      )}
                    </div>
                    {getStatusBadge(quiz.bestAttempt)}
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <FileQuestion className="h-4 w-4 text-blue-500" />
                      <span>{quiz.questionCount} soal</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{quiz.totalPoints} poin</span>
                    </div>
                    {quiz.timeLimit && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span>{formatTime(quiz.timeLimit)}</span>
                      </div>
                    )}
                    {quiz.bestAttempt && (
                      <div className="flex items-center gap-1.5">
                        <Trophy className="h-4 w-4 text-emerald-500" />
                        <span>Skor terbaik: {quiz.bestAttempt.percentage}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() =>
                        router.push(`/chapter/${chapterId}/quiz/${quiz.id}`)
                      }
                      className="bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-blue-600 hover:to-emerald-700 text-white"
                    >
                      {quiz.bestAttempt ? 'Kerjakan Ulang' : 'Mulai Kuis'}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

