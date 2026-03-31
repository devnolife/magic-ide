"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Award,
  AlertCircle,
  Pencil,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AnswerDetail {
  questionId: string;
  questionNumber: number;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "ESSAY" | "MATCHING";
  maxPoints: number;
  points: number;
  studentAnswer: string | null;
  correctAnswer: string | null;
  isCorrect: boolean;
  matchingPairs?: { pair: string; correct: boolean }[];
}

interface StudentResult {
  attemptId: string;
  studentId: string;
  studentName: string;
  username: string;
  score: number;
  maxScore: number;
  percentage: number;
  passed: boolean;
  submittedAt: string | null;
  answers: AnswerDetail[];
}

interface ExamResultsData {
  sessionId: string;
  quizTitle: string;
  classroomName: string;
  status: string;
  passingScore: number;
  totalStudents: number;
  attemptedCount: number;
  averageScore: number;
  passedCount: number;
  results: StudentResult[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("auth-token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function statusBadge(status: string) {
  switch (status) {
    case "ACTIVE":
      return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Aktif</Badge>;
    case "SCHEDULED":
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Terjadwal</Badge>;
    case "COMPLETED":
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Selesai</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function questionTypeBadge(type: string) {
  switch (type) {
    case "MULTIPLE_CHOICE":
      return <Badge variant="outline" className="text-xs">Pilihan Ganda</Badge>;
    case "ESSAY":
      return <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Essay</Badge>;
    case "MATCHING":
      return <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">Menjodohkan</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{type}</Badge>;
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ExamResultsPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [results, setResults] = useState<ExamResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [gradeInputs, setGradeInputs] = useState<Record<string, number>>({});
  const [grading, setGrading] = useState(false);

  /* ---------- data fetcher ---------- */

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/teacher/exam-sessions/${sessionId}/results`,
        { headers: getAuthHeaders() }
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error("Failed to fetch exam results:", err);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchResults().finally(() => setLoading(false));
  }, [fetchResults]);

  /* ---------- essay grading ---------- */

  const handleGrade = async (
    attemptId: string,
    questionId: string,
    newScore: number
  ) => {
    setGrading(true);
    try {
      const res = await fetch(
        `/api/teacher/exam-sessions/${sessionId}/grade`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ attemptId, questionId, newScore }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Gagal menyimpan skor");
        return;
      }
      toast.success("Skor berhasil diperbarui");
      fetchResults();
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setGrading(false);
    }
  };

  /* ---------- loading / error ---------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Gagal memuat hasil ujian.</p>
        <Link href="/teacher/exams">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Ujian
          </Button>
        </Link>
      </div>
    );
  }

  const selectedResult = results.results.find(
    (r) => r.attemptId === selectedStudent
  );

  const passPercentage =
    results.attemptedCount > 0
      ? ((results.passedCount / results.attemptedCount) * 100).toFixed(1)
      : "0.0";

  /* ---------- sorted results ---------- */
  const sortedResults = [...results.results].sort(
    (a, b) => b.percentage - a.percentage
  );

  // Students who haven't attempted — totalStudents minus attemptedCount
  const notAttemptedCount = results.totalStudents - results.attemptedCount;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <Link
          href="/teacher/exams"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Ujian
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Hasil Ujian: {results.quizTitle}
          </h1>
          {statusBadge(results.status)}
        </div>
        <p className="text-muted-foreground mt-1">
          Kelas: {results.classroomName}
        </p>
      </div>

      <Separator />

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2.5">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{results.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Total Siswa</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-2.5">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{results.attemptedCount}</p>
                <p className="text-xs text-muted-foreground">
                  Sudah Mengerjakan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-100 p-2.5">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {results.averageScore.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">Rata-rata Skor</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2.5">
                <Award className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{results.passedCount}</p>
                <p className="text-xs text-muted-foreground">
                  Lulus ({passPercentage}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Student Results Table ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daftar Hasil Siswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-3 pr-4 font-medium">No</th>
                  <th className="pb-3 pr-4 font-medium">Nama</th>
                  <th className="pb-3 pr-4 font-medium">Username</th>
                  <th className="pb-3 pr-4 font-medium">Skor</th>
                  <th className="pb-3 pr-4 font-medium">Persentase</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Waktu</th>
                  <th className="pb-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedResults.map((r, idx) => (
                  <tr key={r.attemptId} className="hover:bg-muted/50">
                    <td className="py-3 pr-4">{idx + 1}</td>
                    <td className="py-3 pr-4 font-medium">
                      {r.studentName || "—"}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">
                      {r.username}
                    </td>
                    <td className="py-3 pr-4">
                      {r.submittedAt ? (
                        `${r.score}/${r.maxScore}`
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {r.submittedAt ? (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                r.passed ? "bg-emerald-500" : "bg-red-400"
                              }`}
                              style={{ width: `${Math.min(r.percentage, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium w-10">
                            {r.percentage.toFixed(0)}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {!r.submittedAt ? (
                        <Badge variant="outline" className="text-gray-500">
                          Belum
                        </Badge>
                      ) : r.passed ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          Lulus
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 border-red-200">
                          Gagal
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground text-xs">
                      {r.submittedAt ? (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(r.submittedAt)}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3">
                      {r.submittedAt && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setSelectedStudent(
                              selectedStudent === r.attemptId
                                ? null
                                : r.attemptId
                            )
                          }
                        >
                          {selectedStudent === r.attemptId ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Rows for students who haven't attempted */}
                {notAttemptedCount > 0 &&
                  sortedResults.length === results.attemptedCount && (
                    <tr className="hover:bg-muted/50">
                      <td
                        colSpan={8}
                        className="py-3 text-center text-xs text-muted-foreground italic"
                      >
                        {notAttemptedCount} siswa belum mengerjakan ujian ini
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Student Detail Panel ── */}
      <AnimatePresence>
        {selectedResult && (
          <motion.div
            key={selectedResult.attemptId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  Detail Jawaban: {selectedResult.studentName || selectedResult.username}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedStudent(null)}
                >
                  <EyeOff className="h-4 w-4 mr-1" />
                  Tutup
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedResult.answers.map((answer) => (
                  <div
                    key={answer.questionId}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    {/* Question header */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm">
                        Soal {answer.questionNumber}
                      </span>
                      {questionTypeBadge(answer.questionType)}
                      <span className="text-xs text-muted-foreground">
                        ({answer.maxPoints} poin)
                      </span>
                      <div className="ml-auto flex items-center gap-1.5">
                        {answer.isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            answer.isCorrect
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {answer.points}/{answer.maxPoints}
                        </span>
                      </div>
                    </div>

                    {/* Question text */}
                    <p className="text-sm text-muted-foreground">
                      {answer.questionText}
                    </p>

                    <Separator />

                    {/* Answer details by type */}
                    {answer.questionType === "MULTIPLE_CHOICE" && (
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-muted-foreground">
                            Jawaban:{" "}
                          </span>
                          <span
                            className={
                              answer.isCorrect
                                ? "text-emerald-600 font-medium"
                                : "text-red-600 font-medium"
                            }
                          >
                            {answer.studentAnswer || "—"}
                          </span>
                        </p>
                        {!answer.isCorrect && (
                          <p>
                            <span className="text-muted-foreground">
                              Jawaban benar:{" "}
                            </span>
                            <span className="text-emerald-600 font-medium">
                              {answer.correctAnswer}
                            </span>
                          </p>
                        )}
                      </div>
                    )}

                    {answer.questionType === "ESSAY" && (
                      <div className="space-y-3">
                        <div className="rounded-md bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground mb-1">
                            Jawaban siswa:
                          </p>
                          <p className="text-sm whitespace-pre-wrap">
                            {answer.studentAnswer || "(Tidak dijawab)"}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            Auto: {answer.points}/{answer.maxPoints}
                          </span>
                          <Pencil className="h-3 w-3 text-muted-foreground" />
                          <Input
                            type="number"
                            min={0}
                            max={answer.maxPoints}
                            value={
                              gradeInputs[
                                `${selectedResult.attemptId}-${answer.questionId}`
                              ] ?? answer.points
                            }
                            onChange={(e) =>
                              setGradeInputs((prev) => ({
                                ...prev,
                                [`${selectedResult.attemptId}-${answer.questionId}`]:
                                  Number(e.target.value),
                              }))
                            }
                            className="w-20 h-8 text-sm"
                          />
                          <Button
                            size="sm"
                            disabled={grading}
                            onClick={() => {
                              const key = `${selectedResult.attemptId}-${answer.questionId}`;
                              const newScore =
                                gradeInputs[key] ?? answer.points;
                              handleGrade(
                                selectedResult.attemptId,
                                answer.questionId,
                                newScore
                              );
                            }}
                          >
                            {grading ? (
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                            ) : null}
                            Simpan
                          </Button>
                        </div>
                      </div>
                    )}

                    {answer.questionType === "MATCHING" && (
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="text-muted-foreground">
                            Jawaban:{" "}
                          </span>
                          <span
                            className={
                              answer.isCorrect
                                ? "text-emerald-600 font-medium"
                                : "text-red-600 font-medium"
                            }
                          >
                            {answer.studentAnswer || "—"}
                          </span>
                        </p>
                        {answer.matchingPairs &&
                          answer.matchingPairs.length > 0 && (
                            <div className="space-y-1">
                              {answer.matchingPairs.map((mp, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  {mp.correct ? (
                                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                  ) : (
                                    <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                                  )}
                                  <span
                                    className={
                                      mp.correct
                                        ? "text-emerald-700"
                                        : "text-red-700"
                                    }
                                  >
                                    {mp.pair}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        {!answer.isCorrect && answer.correctAnswer && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">
                              Jawaban benar:{" "}
                            </span>
                            <span className="text-emerald-600 font-medium">
                              {answer.correctAnswer}
                            </span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
