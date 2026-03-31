'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  AlertCircle,
  Trophy,
  XCircle,
  BookOpen,
  CheckCircle2,
  MinusCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface QuizOption {
  label: string;
  text: string;
}

interface MatchingOptions {
  leftItems: string[];
  rightItems: string[];
}

interface ExamQuestion {
  id: string;
  questionText: string;
  questionType: string;
  points: number;
  order: number;
  options: QuizOption[] | MatchingOptions | null;
}

interface GradedAnswerData {
  questionId: string;
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  correctAnswer: string | null;
  userAnswer: string;
}

interface ExamData {
  session: {
    id: string;
    status: string;
    duration: number | null;
    startedAt: string | null;
    classroom: { name: string };
  };
  quiz: {
    id: string;
    title: string;
    description: string | null;
    chapter: { number: number; title: string } | null;
    questionCount: number;
    totalPoints: number;
  };
  questions: ExamQuestion[];
  alreadySubmitted: boolean;
  existingResult: {
    totalScore: number;
    maxScore: number;
    percentage: number;
    status: string;
    answers?: GradedAnswerData[];
  } | null;
}

interface SubmitResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  status: string;
  answers?: GradedAnswerData[];
}

type Phase = 'loading' | 'info' | 'exam' | 'result' | 'already-done' | 'error';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getToken(): string | null {
  return localStorage.getItem('auth-token');
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

interface ExamDraft {
  answers: Record<string, string>;
  timeLeft: number | null;
  savedAt: string;
  startTime: number;
}

function getDraftKey(sessionId: string): string {
  return `exam-draft-${sessionId}`;
}

function isMatchingOptions(
  opts: QuizOption[] | MatchingOptions | null
): opts is MatchingOptions {
  return opts !== null && 'leftItems' in opts;
}

/* ------------------------------------------------------------------ */
/*  Question Renderers                                                 */
/* ------------------------------------------------------------------ */

function MCQuestion({
  options,
  answer,
  onAnswer,
}: {
  options: QuizOption[];
  answer: string;
  onAnswer: (val: string) => void;
}) {
  return (
    <div className="space-y-3" role="radiogroup" aria-label="Pilihan jawaban">
      {options.map((opt) => {
        const selected = answer === opt.label;
        return (
          <button
            key={opt.label}
            role="radio"
            aria-checked={selected}
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

function EssayQuestion({
  answer,
  onAnswer,
}: {
  answer: string;
  onAnswer: (val: string) => void;
}) {
  return (
    <textarea
      value={answer}
      onChange={(e) => onAnswer(e.target.value)}
      placeholder="Tulis jawaban kamu di sini..."
      rows={6}
      aria-required="true"
      aria-label="Jawaban esai"
      className="w-full p-4 rounded-xl border-2 border-gray-200 bg-white text-sm resize-none focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
    />
  );
}

function MatchingQuestion({
  options,
  answer,
  onAnswer,
}: {
  options: MatchingOptions;
  answer: string;
  onAnswer: (val: string) => void;
}) {
  const current: Record<string, string> = useMemo(() => {
    try {
      return JSON.parse(answer || '{}');
    } catch {
      return {};
    }
  }, [answer]);

  const handleSelect = (left: string, right: string) => {
    const updated = { ...current, [left]: right };
    onAnswer(JSON.stringify(updated));
  };

  return (
    <div className="space-y-4">
      {options.leftItems.map((left, i) => (
        <div key={i} className="flex items-center gap-4">
          <span className="font-medium min-w-[180px] text-sm">{left}</span>
          <span className="text-gray-400">→</span>
          <Select
            value={current[left] || ''}
            onValueChange={(val) => handleSelect(left, val)}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Pilih..." />
            </SelectTrigger>
            <SelectContent>
              {options.rightItems.map((right) => (
                <SelectItem key={right} value={right}>
                  {right}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}

function QuestionRenderer({
  question,
  answer,
  onAnswer,
}: {
  question: ExamQuestion;
  answer: string;
  onAnswer: (val: string) => void;
}) {
  switch (question.questionType) {
    case 'MULTIPLE_CHOICE':
    case 'TRUE_FALSE':
      return (
        <MCQuestion
          options={Array.isArray(question.options) ? question.options : []}
          answer={answer}
          onAnswer={onAnswer}
        />
      );

    case 'MATCHING':
      if (isMatchingOptions(question.options)) {
        return (
          <MatchingQuestion
            options={question.options}
            answer={answer}
            onAnswer={onAnswer}
          />
        );
      }
      return <p className="text-red-500">Format soal matching tidak valid</p>;

    case 'ESSAY':
    case 'SHORT_ANSWER':
    case 'CODING':
      return <EssayQuestion answer={answer} onAnswer={onAnswer} />;

    default:
      return <EssayQuestion answer={answer} onAnswer={onAnswer} />;
  }
}

/* ------------------------------------------------------------------ */
/*  Review Section                                                     */
/* ------------------------------------------------------------------ */

function ReviewSection({
  gradedAnswers,
  questions,
  userAnswers,
}: {
  gradedAnswers: GradedAnswerData[];
  questions: ExamQuestion[];
  userAnswers: Record<string, string>;
}) {
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  function getStatusStyle(ga: GradedAnswerData, questionType: string) {
    if (questionType === 'ESSAY' && ga.points > 0 && ga.points < ga.maxPoints) {
      return {
        border: 'border-amber-300',
        bg: 'bg-amber-50',
        icon: <MinusCircle className="h-5 w-5 text-amber-500" />,
        label: 'Sebagian Benar',
        labelClass: 'text-amber-700 bg-amber-100',
      };
    }
    if (ga.isCorrect || ga.points === ga.maxPoints) {
      return {
        border: 'border-emerald-300',
        bg: 'bg-emerald-50',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        label: 'Benar',
        labelClass: 'text-emerald-700 bg-emerald-100',
      };
    }
    return {
      border: 'border-red-300',
      bg: 'bg-red-50',
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      label: 'Salah',
      labelClass: 'text-red-700 bg-red-100',
    };
  }

  function formatUserAnswer(answer: string, question: ExamQuestion): string {
    if (!answer?.trim()) return '(Tidak dijawab)';

    if (question.questionType === 'MULTIPLE_CHOICE' || question.questionType === 'TRUE_FALSE') {
      if (Array.isArray(question.options)) {
        const opt = question.options.find((o) => o.label === answer);
        return opt ? `${opt.label}. ${opt.text}` : answer;
      }
    }

    if (question.questionType === 'MATCHING') {
      try {
        const parsed = JSON.parse(answer) as Record<string, string>;
        return Object.entries(parsed)
          .map(([left, right]) => `${left} → ${right}`)
          .join(', ');
      } catch {
        return answer;
      }
    }

    return answer;
  }

  function formatCorrectAnswer(correctAnswer: string | null, question: ExamQuestion): string | null {
    if (question.questionType === 'ESSAY') return null;
    if (!correctAnswer) return null;

    if (question.questionType === 'MULTIPLE_CHOICE' || question.questionType === 'TRUE_FALSE') {
      if (Array.isArray(question.options)) {
        const opt = question.options.find((o) => o.label === correctAnswer);
        return opt ? `${opt.label}. ${opt.text}` : correctAnswer;
      }
    }

    return correctAnswer;
  }

  return (
    <div className="space-y-4 mt-6">
      {gradedAnswers.map((ga, idx) => {
        const question = questionMap.get(ga.questionId);
        if (!question) return null;

        const displayAnswer = ga.userAnswer || userAnswers[ga.questionId] || '';
        const style = getStatusStyle(ga, question.questionType);
        const formattedUser = formatUserAnswer(displayAnswer, question);
        const formattedCorrect = formatCorrectAnswer(ga.correctAnswer, question);

        return (
          <Card key={ga.questionId} className={`${style.border} border-2`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {style.icon}
                  <Badge variant="outline" className="text-xs">
                    Soal {idx + 1}
                  </Badge>
                  <Badge className={`text-xs ${style.labelClass}`}>
                    {style.label}
                  </Badge>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {ga.points}/{ga.maxPoints} poin
                </Badge>
              </div>
              <p className="text-sm font-medium mt-2 leading-relaxed">
                {question.questionText}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className={`rounded-lg p-3 ${style.bg}`}>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Jawaban Kamu:
                </p>
                <p className="text-sm whitespace-pre-wrap">{formattedUser}</p>
              </div>

              {formattedCorrect !== null && (
                <div className="rounded-lg p-3 bg-emerald-50 border border-emerald-200">
                  <p className="text-xs font-medium text-emerald-700 mb-1">
                    Jawaban Benar:
                  </p>
                  <p className="text-sm text-emerald-800">{formattedCorrect}</p>
                </div>
              )}

              {question.questionType === 'ESSAY' && (
                <div className="rounded-lg p-3 bg-blue-50 border border-blue-200">
                  <p className="text-xs font-medium text-blue-700">
                    Poin diperoleh: {ga.points} dari {ga.maxPoints} (penilaian otomatis)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [phase, setPhase] = useState<Phase>('loading');
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasAutoSubmitted = useRef(false);

  /* ---- Fetch exam data on mount ---- */
  useEffect(() => {
    async function fetchExam() {
      const token = getToken();
      if (!token) {
        router.replace('/login');
        return;
      }

      try {
        const res = await fetch(`/api/exams/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          router.replace('/login');
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setErrorMsg(
            data.error || 'Gagal memuat data ujian'
          );
          setPhase('error');
          return;
        }

        const data: ExamData = await res.json();
        setExamData(data);

        if (data.alreadySubmitted && data.existingResult) {
          setResult(data.existingResult);
          setPhase('already-done');
          return;
        }

        if (data.session.status !== 'ACTIVE') {
          setErrorMsg('Sesi ujian belum dibuka atau sudah ditutup');
          setPhase('error');
          return;
        }

        setPhase('info');
      } catch {
        setErrorMsg('Terjadi kesalahan saat memuat ujian');
        setPhase('error');
      }
    }

    fetchExam();
  }, [sessionId, router]);

  const sortedQuestions = useMemo(
    () =>
      (examData?.questions ?? []).sort((a, b) => a.order - b.order),
    [examData]
  );

  /* ---- Start exam ---- */
  const handleStart = () => {
    if (!examData) return;
    hasAutoSubmitted.current = false;

    const draftKey = getDraftKey(sessionId);
    let restored = false;

    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const draft: ExamDraft = JSON.parse(raw);

        if (draft.answers && Object.keys(draft.answers).length > 0) {
          setAnswers(draft.answers);
          restored = true;
        }

        if (draft.startTime) {
          startTimeRef.current = draft.startTime;
        }

        if (examData.session.duration && draft.timeLeft !== null && draft.savedAt) {
          const elapsedSinceSave = Math.floor(
            (Date.now() - new Date(draft.savedAt).getTime()) / 1000
          );
          const adjustedTime = Math.max(0, draft.timeLeft - elapsedSinceSave);
          setTimeLeft(adjustedTime);

          if (adjustedTime <= 0) {
            setPhase('exam');
            // defer auto-submit so state is settled
            setTimeout(() => {
              if (!hasAutoSubmitted.current) {
                hasAutoSubmitted.current = true;
                handleSubmit();
              }
            }, 0);
            return;
          }
        } else if (examData.session.duration) {
          startTimeRef.current = Date.now();
          setTimeLeft(examData.session.duration * 60);
        }
      } else {
        startTimeRef.current = Date.now();
        if (examData.session.duration) {
          setTimeLeft(examData.session.duration * 60);
        }
      }
    } catch {
      startTimeRef.current = Date.now();
      if (examData.session.duration) {
        setTimeLeft(examData.session.duration * 60);
      }
    }

    setPhase('exam');

    if (restored) {
      toast.success('Jawaban sebelumnya berhasil dipulihkan');
    }
  };

  /* ---- Submit handler ---- */
  const handleSubmit = useCallback(async () => {
    if (!examData || submitting) return;
    setSubmitting(true);
    setShowConfirm(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const timeSpent = Math.floor(
      (Date.now() - startTimeRef.current) / 1000
    );

    const payload = {
      answers: sortedQuestions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] ?? '',
      })),
      timeSpent,
    };

    try {
      const token = getToken();
      const res = await fetch(`/api/exams/${sessionId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Gagal mengirim jawaban');
      }

      const data: SubmitResult = await res.json();
      localStorage.removeItem(getDraftKey(sessionId));
      setResult(data);
      setPhase('result');
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : 'Gagal mengirim jawaban'
      );
      setPhase('error');
    } finally {
      setSubmitting(false);
    }
  }, [examData, submitting, answers, sortedQuestions, sessionId]);

  /* ---- Timer countdown ---- */
  useEffect(() => {
    if (phase !== 'exam' || timeLeft === null || timeLeft <= 0 || result)
      return;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft !== null, result]);

  /* ---- Auto-submit when timer hits 0 ---- */
  useEffect(() => {
    if (timeLeft === 0 && !hasAutoSubmitted.current && !result) {
      hasAutoSubmitted.current = true;
      handleSubmit();
    }
  }, [timeLeft, handleSubmit, result]);

  /* ---- Cleanup on unmount ---- */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const setAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  /* ---- Auto-save draft to localStorage ---- */
  useEffect(() => {
    if (phase !== 'exam') return;

    const draft: ExamDraft = {
      answers,
      timeLeft,
      savedAt: new Date().toISOString(),
      startTime: startTimeRef.current,
    };

    try {
      localStorage.setItem(getDraftKey(sessionId), JSON.stringify(draft));
    } catch { /* storage full – silently ignore */ }
  }, [answers, timeLeft, phase, sessionId]);

  const answeredCount = sortedQuestions.filter(
    (q) => answers[q.id]?.trim()
  ).length;

  const currentQuestion = sortedQuestions[currentIndex];

  /* ================================================================ */
  /*  RENDER PHASES                                                    */
  /* ================================================================ */

  /* ---- Loading ---- */
  if (phase === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mx-auto" />
          <p className="text-muted-foreground">Memuat ujian...</p>
        </div>
      </div>
    );
  }

  /* ---- Error ---- */
  if (phase === 'error') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-red-600 font-medium">{errorMsg}</p>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Kembali ke Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---- Already submitted ---- */
  if (phase === 'already-done' && result) {
    const passed = result.status === 'COMPLETED';
    const gradedAnswers = result.answers ?? [];
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <CardTitle>Ujian Sudah Dikerjakan</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {passed ? (
                <Trophy className="h-16 w-16 text-emerald-500 mx-auto" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              )}
              <div>
                <p className="text-4xl font-bold">
                  {result.totalScore}{' '}
                  <span className="text-lg text-muted-foreground font-normal">
                    / {result.maxScore}
                  </span>
                </p>
                <p className="text-lg text-muted-foreground mt-1">
                  {result.percentage}%
                </p>
              </div>
              <Badge
                className={`text-sm px-4 py-1 ${
                  passed
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {passed ? 'Lulus' : 'Tidak Lulus'}
              </Badge>

              {gradedAnswers.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowReview((v) => !v)}
                >
                  {showReview ? (
                    <EyeOff className="h-4 w-4 mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {showReview ? 'Sembunyikan Detail' : 'Lihat Detail Jawaban'}
                </Button>
              )}

              <Button
                className="w-full"
                onClick={() => router.push('/dashboard')}
              >
                Kembali ke Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {showReview && gradedAnswers.length > 0 && examData && (
          <ReviewSection
            gradedAnswers={gradedAnswers}
            questions={examData.questions}
            userAnswers={{}}
          />
        )}
      </div>
    );
  }

  /* ---- Pre-exam info ---- */
  if (phase === 'info' && examData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center space-y-2">
            <BookOpen className="h-12 w-12 text-emerald-500 mx-auto" />
            <CardTitle className="text-xl">{examData.quiz.title}</CardTitle>
            {examData.quiz.description && (
              <p className="text-sm text-muted-foreground">
                {examData.quiz.description}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-muted-foreground">Kelas</p>
                <p className="font-semibold">
                  {examData.session.classroom.name}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-muted-foreground">Jumlah Soal</p>
                <p className="font-semibold">{examData.quiz.questionCount}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-muted-foreground">Total Poin</p>
                <p className="font-semibold">{examData.quiz.totalPoints}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-muted-foreground">Waktu</p>
                <p className="font-semibold">
                  {examData.session.duration
                    ? `${examData.session.duration} menit`
                    : 'Tidak terbatas'}
                </p>
              </div>
            </div>

            {examData.quiz.chapter && (
              <p className="text-xs text-muted-foreground text-center">
                Bab {examData.quiz.chapter.number}:{' '}
                {examData.quiz.chapter.title}
              </p>
            )}

            <Separator />

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              <p className="font-medium">⚠️ Perhatian</p>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
                <li>Ujian hanya bisa dikerjakan satu kali</li>
                <li>Jawaban akan otomatis dikirim saat waktu habis</li>
                <li>Pastikan koneksi internet stabil</li>
              </ul>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-blue-600 hover:to-emerald-700 text-white"
              size="lg"
              onClick={handleStart}
            >
              Mulai Ujian
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ---- Result after submit ---- */
  if (phase === 'result' && result) {
    const passed = result.status === 'COMPLETED';
    const gradedAnswers = result.answers ?? [];
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-center">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <CardTitle>Hasil Ujian</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              {passed ? (
                <Trophy className="h-16 w-16 text-emerald-500 mx-auto" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              )}
              <div>
                <p className="text-4xl font-bold">
                  {result.totalScore}{' '}
                  <span className="text-lg text-muted-foreground font-normal">
                    / {result.maxScore}
                  </span>
                </p>
                <p className="text-lg text-muted-foreground mt-1">
                  {result.percentage}%
                </p>
              </div>
              <Badge
                className={`text-sm px-4 py-1 ${
                  passed
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {passed ? 'Lulus' : 'Tidak Lulus'}
              </Badge>

              {gradedAnswers.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowReview((v) => !v)}
                >
                  {showReview ? (
                    <EyeOff className="h-4 w-4 mr-2" />
                  ) : (
                    <Eye className="h-4 w-4 mr-2" />
                  )}
                  {showReview ? 'Sembunyikan Detail' : 'Lihat Detail Jawaban'}
                </Button>
              )}

              <Button
                className="w-full"
                onClick={() => router.push('/dashboard')}
              >
                Kembali ke Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {showReview && gradedAnswers.length > 0 && examData && (
          <ReviewSection
            gradedAnswers={gradedAnswers}
            questions={examData.questions}
            userAnswers={answers}
          />
        )}
      </div>
    );
  }

  /* ---- Exam taking (main) ---- */
  if (phase !== 'exam' || !examData || !currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{examData.quiz.title}</h1>
          <p className="text-sm text-muted-foreground">
            Kelas: {examData.session.classroom.name}
          </p>
        </div>

        {timeLeft !== null && (
          <Badge
            variant="outline"
            role="timer"
            aria-live="polite"
            aria-label={`Sisa waktu: ${formatTimer(timeLeft)}`}
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

      {/* Question navigation dots */}
      <div className="flex flex-wrap gap-2" role="navigation" aria-label="Navigasi soal">
        {sortedQuestions.map((q, i) => {
          const isAnswered = !!answers[q.id]?.trim();
          const isCurrent = i === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Soal ${i + 1}, ${isAnswered ? 'sudah dijawab' : 'belum dijawab'}${isCurrent ? ', sedang aktif' : ''}`}
              aria-current={isCurrent ? 'step' : undefined}
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
      <Card>
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

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          aria-label="Soal sebelumnya"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Sebelumnya
        </Button>

        <span className="text-sm text-muted-foreground">
          {answeredCount}/{sortedQuestions.length} dijawab
        </span>

        {currentIndex < sortedQuestions.length - 1 ? (
          <Button
            onClick={() =>
              setCurrentIndex((i) =>
                Math.min(sortedQuestions.length - 1, i + 1)
              )
            }
            aria-label="Soal selanjutnya"
            className="bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-blue-600 hover:to-emerald-700 text-white"
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <div /> // spacer
        )}
      </div>

      {/* Submit button */}
      <div className="pt-2">
        <Button
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
          size="lg"
          disabled={submitting}
          onClick={() => setShowConfirm(true)}
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Kumpulkan Ujian
        </Button>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Kumpulkan Ujian?</DialogTitle>
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
              Kembali
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Ya, Kumpulkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
