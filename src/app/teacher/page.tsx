"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  School,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  Loader2,
  Inbox,
  ClipboardList,
  BookOpen,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  BarChart3,
  UserCheck,
  AlertTriangle,
} from "lucide-react";

interface ClassroomSummary {
  id: string;
  name: string;
  description: string | null;
  _count: { students: number };
  createdAt: string;
}

interface ExamSession {
  id: string;
  status: "SCHEDULED" | "ACTIVE" | "CLOSED";
  classroomId: string;
  quizId: string;
  createdAt: string;
  classroom: { id: string; name: string };
  quiz: {
    id: string;
    title: string;
    description: string;
    timeLimit: number;
    chapter: { number: number; title: string };
    _count: { questions: number };
  };
  attemptCount: number;
}

interface StudentQuiz {
  quizId: string;
  quizTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  status: string;
  attemptedAt: string;
}

interface StudentProgress {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  completedLessons: number;
  totalLessons: number;
  completedChallenges: number;
  totalChallenges: number;
  totalPoints: number;
  timeSpent: number;
}

interface StudentDetail {
  id: string;
  name: string;
  username: string;
  joinedAt: string;
  classroomName: string;
  progress: StudentProgress[];
  quizzes: StudentQuiz[];
  completionPercentage: number;
  lastActivity: string | null;
}

interface ExamStats {
  totalSessions: number;
  scheduled: number;
  active: number;
  closed: number;
  averageScore: number;
  passRate: number;
  totalAttempts: number;
}

interface ProgressDistribution {
  label: string;
  range: string;
  count: number;
  percentage: number;
  color: string;
  bgColor: string;
}

interface DashboardData {
  totalClassrooms: number;
  totalStudents: number;
  averageProgress: number;
  recentClassrooms: ClassroomSummary[];
  examStats: ExamStats;
  studentDetails: StudentDetail[];
  progressDistribution: ProgressDistribution[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function computeStudentCompletion(progress: StudentProgress[]): number {
  if (progress.length === 0) return 0;
  const totalLessons = progress.reduce((s, p) => s + p.totalLessons, 0);
  const completedLessons = progress.reduce((s, p) => s + p.completedLessons, 0);
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons / totalLessons) * 100);
}

function getLastActivity(student: { joinedAt: string; quizzes: StudentQuiz[]; progress: StudentProgress[] }): string | null {
  const dates: number[] = [];
  if (student.joinedAt) dates.push(new Date(student.joinedAt).getTime());
  student.quizzes.forEach((q) => {
    if (q.attemptedAt) dates.push(new Date(q.attemptedAt).getTime());
  });
  if (dates.length === 0) return null;
  return new Date(Math.max(...dates)).toISOString();
}

function isInactive(lastActivity: string | null): boolean {
  if (!lastActivity) return true;
  const diff = Date.now() - new Date(lastActivity).getTime();
  return diff > 7 * 24 * 60 * 60 * 1000;
}

function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return "Tidak ada data";
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`;
  return `${Math.floor(days / 30)} bulan lalu`;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const headers = { Authorization: `Bearer ${token}` };

      const [classroomRes, examRes] = await Promise.all([
        fetch("/api/classrooms", { headers }),
        fetch("/api/teacher/exam-sessions", { headers }),
      ]);

      let classrooms: ClassroomSummary[] = [];
      if (classroomRes.ok) {
        const cData = await classroomRes.json();
        classrooms = Array.isArray(cData) ? cData : (cData.classrooms ?? []);
      }

      const totalStudents = classrooms.reduce(
        (sum, c) => sum + (c._count?.students ?? 0),
        0
      );

      // Fetch exam session stats
      const examStats: ExamStats = {
        totalSessions: 0, scheduled: 0, active: 0, closed: 0,
        averageScore: 0, passRate: 0, totalAttempts: 0,
      };
      if (examRes.ok) {
        const examData = await examRes.json();
        const sessions: ExamSession[] = examData.sessions ?? [];
        examStats.totalSessions = sessions.length;
        examStats.scheduled = sessions.filter((s) => s.status === "SCHEDULED").length;
        examStats.active = sessions.filter((s) => s.status === "ACTIVE").length;
        examStats.closed = sessions.filter((s) => s.status === "CLOSED").length;
      }

      // Fetch progress for each classroom
      const allStudentDetails: StudentDetail[] = [];
      let totalProgress = 0;
      let progressCount = 0;
      let totalQuizScore = 0;
      let quizCount = 0;
      let passedQuizzes = 0;

      await Promise.all(
        classrooms.map(async (c) => {
          try {
            const pRes = await fetch(`/api/classrooms/${c.id}/progress`, { headers });
            if (pRes.ok) {
              const progressData = await pRes.json();
              const students = progressData.students ?? [];
              students.forEach(
                (s: { id: string; name: string; username: string; joinedAt: string; progress: StudentProgress[]; quizzes: StudentQuiz[] }) => {
                  const completion = computeStudentCompletion(s.progress);
                  const lastAct = getLastActivity(s);
                  totalProgress += completion;
                  progressCount++;

                  s.quizzes.forEach((q) => {
                    totalQuizScore += q.percentage;
                    quizCount++;
                    if (q.status === "COMPLETED") passedQuizzes++;
                  });

                  allStudentDetails.push({
                    ...s,
                    classroomName: c.name,
                    completionPercentage: completion,
                    lastActivity: lastAct,
                  });
                }
              );
            }
          } catch {
            // skip
          }
        })
      );

      examStats.averageScore = quizCount > 0 ? Math.round(totalQuizScore / quizCount) : 0;
      examStats.passRate = quizCount > 0 ? Math.round((passedQuizzes / quizCount) * 100) : 0;
      examStats.totalAttempts = quizCount;

      // Compute progress distribution
      const dist = [
        { label: "Pemula", range: "0–25%", min: 0, max: 25, color: "bg-red-500", bgColor: "bg-red-100" },
        { label: "Berkembang", range: "26–50%", min: 26, max: 50, color: "bg-yellow-500", bgColor: "bg-yellow-100" },
        { label: "Mahir", range: "51–75%", min: 51, max: 75, color: "bg-blue-500", bgColor: "bg-blue-100" },
        { label: "Tuntas", range: "76–100%", min: 76, max: 100, color: "bg-emerald-500", bgColor: "bg-emerald-100" },
      ];

      const progressDistribution: ProgressDistribution[] = dist.map((d) => {
        const count = allStudentDetails.filter(
          (s) => s.completionPercentage >= d.min && s.completionPercentage <= d.max
        ).length;
        return {
          label: d.label,
          range: d.range,
          count,
          percentage: allStudentDetails.length > 0 ? Math.round((count / allStudentDetails.length) * 100) : 0,
          color: d.color,
          bgColor: d.bgColor,
        };
      });

      setData({
        totalClassrooms: classrooms.length,
        totalStudents,
        averageProgress: progressCount > 0 ? Math.round(totalProgress / progressCount) : 0,
        recentClassrooms: classrooms.slice(0, 5),
        examStats,
        studentDetails: allStudentDetails,
        progressDistribution,
      });
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-500">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Kelas",
      value: data?.totalClassrooms ?? 0,
      icon: School,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      trend: data?.totalClassrooms ? `${data.totalClassrooms} kelas aktif` : null,
    },
    {
      label: "Total Murid",
      value: data?.totalStudents ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
      trend: data?.totalStudents ? `Tersebar di ${data.totalClassrooms} kelas` : null,
    },
    {
      label: "Rata-rata Progress",
      value: `${data?.averageProgress ?? 0}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
      trend: (data?.averageProgress ?? 0) >= 50
        ? "↑ Di atas rata-rata"
        : (data?.averageProgress ?? 0) > 0
          ? "↓ Perlu perhatian"
          : null,
    },
  ];

  const recentlyActive = data?.studentDetails
    ? [...data.studentDetails]
        .sort((a, b) => {
          const aTime = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
          const bTime = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
          return bTime - aTime;
        })
        .slice(0, 8)
    : [];

  const inactiveCount = data?.studentDetails.filter((s) => isInactive(s.lastActivity)).length ?? 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Greeting */}
      <motion.div variants={itemVariants}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Selamat Datang, {user?.name || user?.username}!
              </h1>
            </div>
            <p className="text-muted-foreground">
              Kelola kelas dan pantau perkembangan murid Anda.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="border shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {stat.value}
                    </p>
                    {stat.trend && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.trend}
                      </p>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap gap-3"
      >
        <Link href="/teacher/classrooms/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Buat Kelas Baru
          </Button>
        </Link>
        <Link href="/teacher/exams">
          <Button variant="outline" className="w-full sm:w-auto">
            <ClipboardList className="h-4 w-4 mr-2" />
            Buka Sesi Ujian
          </Button>
        </Link>
        <Link href="/teacher/materials">
          <Button variant="outline" className="w-full sm:w-auto">
            <BookOpen className="h-4 w-4 mr-2" />
            Lihat Materi
          </Button>
        </Link>
      </motion.div>

      {/* Statistik Ujian & Distribusi Progress */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Statistik Ujian */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-emerald-600" />
              Statistik Ujian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Total Sesi</p>
                <p className="text-2xl font-bold">{data?.examStats.totalSessions ?? 0}</p>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {(data?.examStats.scheduled ?? 0) > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {data?.examStats.scheduled} terjadwal
                    </Badge>
                  )}
                  {(data?.examStats.active ?? 0) > 0 && (
                    <Badge className="text-xs bg-emerald-600">
                      <Activity className="h-3 w-3 mr-1" />
                      {data?.examStats.active} aktif
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Total Percobaan</p>
                <p className="text-2xl font-bold">{data?.examStats.totalAttempts ?? 0}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Rata-rata Nilai</p>
                <p className="text-2xl font-bold">{data?.examStats.averageScore ?? 0}%</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Tingkat Kelulusan</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{data?.examStats.passRate ?? 0}%</p>
                  {(data?.examStats.passRate ?? 0) >= 70 ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (data?.examStats.totalAttempts ?? 0) > 0 ? (
                    <XCircle className="h-5 w-5 text-red-500" />
                  ) : null}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Distribusi Progress */}
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Distribusi Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.progressDistribution && data.progressDistribution.some((d) => d.count > 0) ? (
              data.progressDistribution.map((dist) => (
                <div key={dist.range} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{dist.label} <span className="text-muted-foreground">({dist.range})</span></span>
                    <span className="font-semibold">{dist.count} siswa</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${dist.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${dist.percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Belum ada data progress siswa.</p>
              </div>
            )}
            {data?.studentDetails && data.studentDetails.length > 0 && (
              <p className="text-xs text-muted-foreground pt-2 border-t">
                Total {data.studentDetails.length} siswa dari {data.totalClassrooms} kelas
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Siswa Aktif */}
      <motion.div variants={itemVariants}>
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-emerald-600" />
              Siswa Aktif
            </CardTitle>
            {inactiveCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {inactiveCount} siswa tidak aktif
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {recentlyActive.length > 0 ? (
              <div className="space-y-2">
                {recentlyActive.map((student) => {
                  const inactive = isInactive(student.lastActivity);
                  return (
                    <div
                      key={`${student.id}-${student.classroomName}`}
                      className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                        inactive ? "bg-red-50 dark:bg-red-950/20" : "bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                          inactive
                            ? "bg-gray-400"
                            : "bg-gradient-to-br from-emerald-500 to-blue-500"
                        }`}>
                          {student.name?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {student.name || student.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {student.classroomName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge variant="secondary" className="text-xs mb-0.5">
                            {student.completionPercentage}%
                          </Badge>
                          <p className={`text-xs ${inactive ? "text-red-500 font-medium" : "text-muted-foreground"}`}>
                            {formatRelativeDate(student.lastActivity)}
                          </p>
                        </div>
                        {inactive && (
                          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>Belum ada data aktivitas siswa.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Classrooms */}
      <motion.div variants={itemVariants}>
        <Card className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <School className="h-5 w-5 text-primary" />
              Kelas Terbaru
            </CardTitle>
            <Link href="/teacher/classrooms">
              <Button variant="ghost" size="sm" className="text-primary">
                Lihat Semua
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data?.recentClassrooms && data.recentClassrooms.length > 0 ? (
              <div className="space-y-3">
                {data.recentClassrooms.map((classroom) => (
                  <Link
                    key={classroom.id}
                    href={`/teacher/classrooms/${classroom.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-accent transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {classroom.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {classroom.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {classroom.description || "Tidak ada deskripsi"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {classroom._count?.students ?? 0} murid
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Inbox className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Belum ada kelas.</p>
                <Link href="/teacher/classrooms/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Kelas Pertama
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
