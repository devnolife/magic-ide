'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { QuizResult } from '@/components/quiz/QuizResult';

interface QuizOption {
  label: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'CODING' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options: QuizOption[] | null;
  points: number;
  order: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number | null;
  questions: QuizQuestion[];
}

interface SubmitResult {
  attemptId: string;
  totalScore: number;
  maxScore: number;
  percentage: number;
  status: string;
  answers: {
    questionId: string;
    isCorrect: boolean;
    points: number;
    correctAnswer: string;
  }[];
}

// Dynamically import CodeEditor to avoid SSR issues with Monaco
let CodeEditorComponent: React.ComponentType<{
  code: string;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onReset: () => void;
  height?: string;
}> | null = null;

function CodingInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [EditorComp, setEditorComp] = useState<typeof CodeEditorComponent>(null);

  useEffect(() => {
    import('@/components/CodeEditor')
      .then((mod) => {
        setEditorComp(
          () => mod.CodeEditor as unknown as typeof CodeEditorComponent
        );
      })
      .catch(() => {
        // CodeEditor not available, will fall back to textarea
      });
  }, []);

  if (EditorComp) {
    return (
      <EditorComp
        code={value}
        onCodeChange={onChange}
        onRun={() => {}}
        onReset={() => onChange('')}
        height="250px"
      />
    );
  }

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Tulis kode Python kamu di sini..."
      className="w-full h-[250px] p-4 rounded-lg border bg-gray-50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
      spellCheck={false}
    />
  );
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function QuestionRenderer({
  question,
  answer,
  onAnswer,
}: {
  question: QuizQuestion;
  answer: string;
  onAnswer: (val: string) => void;
}) {
  switch (question.questionType) {
    case 'MULTIPLE_CHOICE': {
      const options: QuizOption[] = Array.isArray(question.options)
        ? question.options
        : [];
      return (
        <div className="space-y-3">
          {options.map((opt) => {
            const selected = answer === opt.label;
            return (
              <button
                key={opt.label}
                onClick={() => onAnswer(opt.label)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3 ${
                  selected
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
                }`}
              >
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    selected
                      ? 'bg-gradient-to-br from-blue-500 to-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {opt.label}
                </span>
                <span className="pt-1 text-sm">{opt.text}</span>
              </button>
            );
          })}
        </div>
      );
    }

    case 'TRUE_FALSE':
      return (
        <div className="flex gap-4">
          {[
            { val: 'true', label: 'Benar' },
            { val: 'false', label: 'Salah' },
          ].map(({ val, label }) => {
            const selected = answer === val;
            return (
              <button
                key={val}
                onClick={() => onAnswer(val)}
                className={`flex-1 p-6 rounded-xl border-2 text-center font-semibold text-lg transition-all duration-200 ${
                  selected
                    ? 'border-emerald-500 bg-emerald-50 shadow-md text-emerald-700'
                    : 'border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 text-gray-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      );

    case 'SHORT_ANSWER':
      return (
        <input
          type="text"
          value={answer}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Ketik jawaban kamu di sini..."
          className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
        />
      );

    case 'CODING':
      return <CodingInput value={answer} onChange={onAnswer} />;

    default:
      return (
        <input
          type="text"
          value={answer}
          onChange={(e) => onAnswer(e.target.value)}
          placeholder="Ketik jawaban kamu..."
          className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
        />
      );
  }
}

export default function TakeQuizPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.id as string;
  const quizId = params.quizId as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAutoSubmitted = useRef(false);

  // Fetch quiz data
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const token = localStorage.getItem('auth-token');
        const res = await fetch(`/api/quizzes/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Gagal memuat kuis');
        const data: Quiz = await res.json();
        setQuiz(data);
        if (data.timeLimit) {
          setTimeLeft(data.timeLimit);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [quizId]);

  const sortedQuestions = useMemo(
    () => (quiz?.questions ?? []).sort((a, b) => a.order - b.order),
    [quiz]
  );

  // Submit handler
  const handleSubmit = useCallback(async () => {
    if (!quiz || submitting) return;
    setSubmitting(true);
    setShowConfirm(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const payload = {
      answers: sortedQuestions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] ?? '',
      })),
      timeSpent,
    };

    try {
      const token = localStorage.getItem('auth-token');
      const res = await fetch(`/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Gagal mengirim jawaban');
      const data: SubmitResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim jawaban');
    } finally {
      setSubmitting(false);
    }
  }, [quiz, submitting, answers, sortedQuestions, quizId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || result) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft !== null, result]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !hasAutoSubmitted.current && !result) {
      hasAutoSubmitted.current = true;
      handleSubmit();
    }
  }, [timeLeft, handleSubmit, result]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const answeredCount = sortedQuestions.filter((q) => answers[q.id]?.trim()).length;
  const progressPercent =
    sortedQuestions.length > 0
      ? Math.round((answeredCount / sortedQuestions.length) * 100)
      : 0;
  const currentQuestion = sortedQuestions[currentIndex];

  // --- Loading ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mx-auto" />
          <p className="text-muted-foreground">Memuat kuis...</p>
        </div>
      </div>
    );
  }

  // --- Error ---
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full bg-white/70 backdrop-blur-md border-white/20">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-red-600 font-medium">{error}</p>
            <Button variant="outline" onClick={() => router.back()}>
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz || sortedQuestions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full bg-white/70 backdrop-blur-md border-white/20">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto" />
            <p className="text-muted-foreground">Kuis tidak ditemukan atau tidak memiliki soal.</p>
            <Button variant="outline" onClick={() => router.back()}>
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Result ---
  if (result) {
    return (
      <QuizResult
        totalScore={result.totalScore}
        maxScore={result.maxScore}
        percentage={result.percentage}
        status={result.status}
        answers={result.answers}
        questions={sortedQuestions}
        userAnswers={answers}
        onBackToList={() => router.push(`/chapter/${chapterId}/quiz`)}
        onRetry={() => {
          setResult(null);
          setAnswers({});
          setCurrentIndex(0);
          hasAutoSubmitted.current = false;
          startTimeRef.current = Date.now();
          if (quiz.timeLimit) setTimeLeft(quiz.timeLimit);
        }}
      />
    );
  }

  // --- Quiz Taking ---
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/chapter/${chapterId}/quiz`)}
            className="text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Keluar
          </Button>

          {timeLeft !== null && (
            <Badge
              variant="outline"
              className={`text-base px-3 py-1 font-mono ${
                timeLeft <= 60
                  ? 'border-red-400 text-red-600 animate-pulse'
                  : timeLeft <= 300
                  ? 'border-orange-400 text-orange-600'
                  : 'border-gray-300 text-gray-600'
              }`}
            >
              <Clock className="h-4 w-4 mr-1.5" />
              {formatTimer(timeLeft)}
            </Badge>
          )}
        </div>

        <div>
          <h1 className="text-xl font-bold">{quiz.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">
              {answeredCount}/{sortedQuestions.length} soal dijawab
            </span>
          </div>
        </div>

        <Progress value={progressPercent} />
      </motion.div>

      {/* Question Number Navigation */}
      <div className="flex flex-wrap gap-2">
        {sortedQuestions.map((q, i) => {
          const isAnswered = !!answers[q.id]?.trim();
          const isCurrent = i === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
                isCurrent
                  ? 'bg-gradient-to-br from-blue-500 to-emerald-600 text-white shadow-md scale-110'
                  : isAnswered
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-500 border border-gray-200 hover:border-emerald-300'
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <Separator />

      {/* Current Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  Soal {currentIndex + 1} dari {sortedQuestions.length}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {currentQuestion.points} poin
                </Badge>
              </div>
              <CardTitle className="text-base font-semibold mt-2 leading-relaxed">
                {currentQuestion.questionText}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionRenderer
                question={currentQuestion}
                answer={answers[currentQuestion.id] ?? ''}
                onAnswer={(val) => setAnswer(currentQuestion.id, val)}
              />
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Sebelumnya
        </Button>

        {currentIndex < sortedQuestions.length - 1 ? (
          <Button
            onClick={() =>
              setCurrentIndex((i) =>
                Math.min(sortedQuestions.length - 1, i + 1)
              )
            }
            className="bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-blue-600 hover:to-emerald-700 text-white"
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={submitting}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Kirim Jawaban
          </Button>
        )}
      </div>

      {/* Confirm Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kirim Jawaban?</DialogTitle>
            <DialogDescription>
              Kamu telah menjawab{' '}
              <span className="font-semibold text-foreground">
                {answeredCount}
              </span>{' '}
              dari{' '}
              <span className="font-semibold text-foreground">
                {sortedQuestions.length}
              </span>{' '}
              soal.
              {answeredCount < sortedQuestions.length && (
                <span className="text-orange-600 block mt-1">
                  ⚠️ Ada {sortedQuestions.length - answeredCount} soal yang
                  belum dijawab.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Periksa Lagi
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              )}
              Ya, Kirim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

