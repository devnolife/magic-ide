"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Play,
  Square,
  Trash2,
  RefreshCw,
  Plus,
  Users,
  Clock,
  BookOpen,
  Eye,
} from "lucide-react";
import { LottieAnimation } from "@/components/animations/LottieAnimation";
import { examQuestions } from "@/data/examQuestions";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const getToken = () => localStorage.getItem("auth-token");

function statusBadge(status: string) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
          <Play className="h-3 w-3 mr-1" />
          Aktif
        </Badge>
      );
    case "SCHEDULED":
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-300">
          <Clock className="h-3 w-3 mr-1" />
          Terjadwal
        </Badge>
      );
    case "CLOSED":
      return (
        <Badge className="bg-gray-100 text-gray-600 border-gray-300">
          <Square className="h-3 w-3 mr-1" />
          Ditutup
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

export default function TeacherExamsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [creating, setCreating] = useState(false);

  const headers = useCallback(
    () => ({
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    }),
    []
  );

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/teacher/exam-sessions", {
        headers: headers(),
      });
      if (res.ok) {
        const data = await res.json();
        setSessions(Array.isArray(data) ? data : data.sessions ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  }, [headers]);

  const fetchClassrooms = useCallback(async () => {
    try {
      const res = await fetch("/api/classrooms", { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setClassrooms(Array.isArray(data) ? data : data.classrooms ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch classrooms:", err);
    }
  }, [headers]);

  const fetchQuizzes = useCallback(async () => {
    try {
      const res = await fetch("/api/quizzes", { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setQuizzes(Array.isArray(data) ? data : data.quizzes ?? []);
      }
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
    }
  }, [headers]);

  useEffect(() => {
    Promise.all([fetchSessions(), fetchClassrooms(), fetchQuizzes()]).finally(
      () => setLoading(false)
    );
  }, [fetchSessions, fetchClassrooms, fetchQuizzes]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/exams/seed", {
        method: "POST",
        headers: headers(),
      });
      if (res.ok) {
        await fetchQuizzes();
      }
    } catch (err) {
      console.error("Seed failed:", err);
    } finally {
      setSeeding(false);
    }
  };

  const handleCreateSession = async () => {
    if (!selectedClassroom || !selectedQuiz) return;
    setCreating(true);
    try {
      const res = await fetch("/api/teacher/exam-sessions", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          classroomId: selectedClassroom,
          quizId: selectedQuiz,
        }),
      });
      if (res.ok) {
        await fetchSessions();
        setSelectedClassroom("");
        setSelectedQuiz("");
      }
    } catch (err) {
      console.error("Create session failed:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/teacher/exam-sessions/${id}`, {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) await fetchSessions();
    } catch (err) {
      console.error("Update status failed:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/teacher/exam-sessions/${id}`, {
        method: "DELETE",
        headers: headers(),
      });
      if (res.ok) await fetchSessions();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const questionTypeBreakdown = (
    questions: (typeof examQuestions)[0]["questions"]
  ) => {
    const mc = questions.filter(
      (q) => q.questionType === "MULTIPLE_CHOICE"
    ).length;
    const essay = questions.filter((q) => q.questionType === "ESSAY").length;
    const matching = questions.filter(
      (q) => q.questionType === "MATCHING"
    ).length;
    return { mc, essay, matching };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <LottieAnimation
            src="/asset/loading-python.json"
            width={120}
            height={120}
          />
          <p className="mt-4 text-gray-500">Memuat data ujian...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-1">
          <ClipboardList className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Manajemen Ujian
          </h1>
        </div>
        <p className="text-muted-foreground">
          Kelola ujian dan sesi ujian untuk kelas Anda
        </p>
      </motion.div>

      {/* Seed Button */}
      <motion.div variants={itemVariants}>
        <Button
          onClick={handleSeed}
          disabled={seeding}
          variant="outline"
          className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${seeding ? "animate-spin" : ""}`}
          />
          {seeding ? "Menyinkronkan..." : "Sinkronkan Soal ke Database"}
        </Button>
      </motion.div>

      {/* Active Sessions */}
      <motion.div variants={itemVariants} className="space-y-4">
        <Separator />
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Play className="h-5 w-5 text-emerald-600" />
          Sesi Ujian Aktif
        </h2>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sessions.map((session) => (
              <motion.div key={session.id} variants={itemVariants}>
                <Card className="border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          {session.classroom?.name ?? "Kelas"}
                        </p>
                        <CardTitle className="text-base leading-tight truncate">
                          {session.quiz?.title ?? "Ujian"}
                        </CardTitle>
                      </div>
                      {statusBadge(session.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {session._count?.attempts ?? session.attemptCount ?? 0}{" "}
                        siswa sudah mengerjakan
                      </Badge>
                    </div>

                    <div className="mt-auto pt-2 flex flex-wrap gap-2">
                      {session.status === "SCHEDULED" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() =>
                              handleUpdateStatus(session.id, "ACTIVE")
                            }
                          >
                            <Play className="h-3.5 w-3.5 mr-1" />
                            Aktifkan
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(session.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Hapus
                          </Button>
                        </>
                      )}
                      {session.status === "ACTIVE" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() =>
                              handleUpdateStatus(session.id, "CLOSED")
                            }
                          >
                            <Square className="h-3.5 w-3.5 mr-1" />
                            Tutup Sesi
                          </Button>
                          <Link href={`/teacher/exams/${session.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" />
                              Lihat Hasil
                            </Button>
                          </Link>
                        </>
                      )}
                      {session.status === "CLOSED" && (
                        <Link href={`/teacher/exams/${session.id}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Lihat Hasil
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-8 text-center text-muted-foreground">
              <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>Belum ada sesi ujian. Buat sesi ujian baru di bawah.</p>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Create New Session */}
      <motion.div variants={itemVariants} className="space-y-4">
        <Separator />
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Plus className="h-5 w-5 text-emerald-600" />
          Buka Sesi Ujian Baru
        </h2>

        <Card className="border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2 w-full">
                <label className="text-sm font-medium text-foreground">
                  Pilih Kelas
                </label>
                <Select
                  value={selectedClassroom}
                  onValueChange={setSelectedClassroom}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas..." />
                  </SelectTrigger>
                  <SelectContent>
                    {classrooms.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-2 w-full">
                <label className="text-sm font-medium text-foreground">
                  Pilih Ujian
                </label>
                <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih ujian..." />
                  </SelectTrigger>
                  <SelectContent>
                    {quizzes.map((q) => (
                      <SelectItem key={q.id} value={q.id}>
                        {q.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCreateSession}
                disabled={creating || !selectedClassroom || !selectedQuiz}
                className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                {creating ? "Membuat..." : "Buka Sesi Ujian"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Available Exams */}
      <motion.div variants={itemVariants} className="space-y-4">
        <Separator />
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-600" />
          Daftar Ujian Tersedia
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {examQuestions.map((exam) => {
            const { mc, essay, matching } = questionTypeBreakdown(
              exam.questions
            );
            return (
              <motion.div key={exam.chapterNumber} variants={itemVariants}>
                <Card className="border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                        {exam.chapterNumber}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Chapter {exam.chapterNumber}
                        </p>
                        <CardTitle className="text-base leading-tight truncate">
                          {exam.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {exam.description}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {exam.questions.length} soal
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {exam.timeLimit} menit
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                      <span>PG: {mc}</span>
                      <span>•</span>
                      <span>Essay: {essay}</span>
                      <span>•</span>
                      <span>Menjodohkan: {matching}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
