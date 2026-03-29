'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowLeft,
  Star,
  RotateCcw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface AnswerResult {
  questionId: string;
  isCorrect: boolean;
  points: number;
  correctAnswer: string;
}

interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: string;
  options: { label: string; text: string }[] | null;
  points: number;
  order: number;
}

interface QuizResultProps {
  totalScore: number;
  maxScore: number;
  percentage: number;
  status: string;
  answers: AnswerResult[];
  questions: QuizQuestion[];
  userAnswers: Record<string, string>;
  onBackToList: () => void;
  onRetry: () => void;
}

function CircularScore({ percentage, passed }: { percentage: number; passed: boolean }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const color = passed ? '#22c55e' : '#ef4444';

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="10"
        />
        <motion.circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {percentage}%
        </motion.span>
        <span className="text-sm text-muted-foreground">Skor</span>
      </div>
    </div>
  );
}

export function QuizResult({
  totalScore,
  maxScore,
  percentage,
  status,
  answers,
  questions,
  userAnswers,
  onBackToList,
  onRetry,
}: QuizResultProps) {
  const passed = percentage >= 60;
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl overflow-hidden">
          <div
            className={`h-2 ${
              passed
                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                : 'bg-gradient-to-r from-red-400 to-rose-500'
            }`}
          />
          <CardContent className="pt-8 pb-6 text-center space-y-5">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            >
              {passed ? (
                <Trophy className="h-14 w-14 text-yellow-500 mx-auto" />
              ) : (
                <RotateCcw className="h-14 w-14 text-red-400 mx-auto" />
              )}
            </motion.div>

            <div>
              <h2
                className={`text-2xl font-bold ${
                  passed ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {passed ? 'Selamat, Kamu Lulus! 🎉' : 'Belum Lulus, Coba Lagi! 💪'}
              </h2>
              <p className="text-muted-foreground mt-1">
                {passed
                  ? 'Kerja bagus! Kamu telah menguasai materi ini.'
                  : 'Jangan menyerah, pelajari kembali materinya dan coba lagi.'}
              </p>
            </div>

            <CircularScore percentage={percentage} passed={passed} />

            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {totalScore}
                  <span className="text-base font-normal text-muted-foreground">
                    /{maxScore}
                  </span>
                </p>
                <p className="text-muted-foreground">Total Poin</p>
              </div>
              <Separator orientation="vertical" className="h-10" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {answers.filter((a) => a.isCorrect).length}
                  <span className="text-base font-normal text-muted-foreground">
                    /{answers.length}
                  </span>
                </p>
                <p className="text-muted-foreground">Jawaban Benar</p>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button variant="outline" onClick={onBackToList}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              {!passed && (
                <Button
                  onClick={onRetry}
                  className="bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-blue-600 hover:to-emerald-700 text-white"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Coba Lagi
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold mb-3">Detail Jawaban</h3>
        <div className="space-y-3">
          {sortedQuestions.map((question, index) => {
            const result = answers.find((a) => a.questionId === question.id);
            const userAnswer = userAnswers[question.id];
            const isCorrect = result?.isCorrect ?? false;

            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.08 }}
              >
                <Card
                  className={`bg-white/70 backdrop-blur-md border-l-4 ${
                    isCorrect
                      ? 'border-l-green-500'
                      : 'border-l-red-500'
                  } shadow-sm`}
                >
                  <CardContent className="py-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1">
                        <span className="flex-shrink-0 mt-0.5">
                          {isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            <span className="text-muted-foreground mr-1.5">
                              {index + 1}.
                            </span>
                            {question.questionText}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="flex-shrink-0"
                      >
                        <Star className="h-3 w-3 mr-1" />
                        {result?.points ?? 0}/{question.points}
                      </Badge>
                    </div>

                    <div className="ml-7 space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Jawaban kamu: </span>
                        <span
                          className={`font-medium ${
                            isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {userAnswer || '(tidak dijawab)'}
                        </span>
                      </p>
                      {!isCorrect && result?.correctAnswer && (
                        <p>
                          <span className="text-muted-foreground">
                            Jawaban benar:{' '}
                          </span>
                          <span className="font-medium text-green-600">
                            {result.correctAnswer}
                          </span>
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
