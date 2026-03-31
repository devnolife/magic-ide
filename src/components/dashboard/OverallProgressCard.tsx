"use client";

import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, BarChart3, Trophy, Download, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ChapterProgress } from "./ChapterGrid";

interface OverallProgressCardProps {
  progressData: ChapterProgress[];
}

function getMotivationalMessage(percent: number): string {
  if (percent === 0) return "Mulai perjalanan Python-mu! 🚀";
  if (percent <= 25) return "Awal yang bagus! Terus belajar! 💪";
  if (percent <= 50) return "Pertengahan jalan! Kamu hebat! ⭐";
  if (percent <= 75) return "Lebih dari setengah! Hampir sampai! 🎯";
  if (percent < 100) return "Sebentar lagi selesai! Semangat! 🔥";
  return "Selamat! Semua materi selesai! 🎉🏆";
}

export function OverallProgressCard({ progressData }: OverallProgressCardProps) {
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = useCallback(async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      const res = await fetch("/api/progress/export", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        toast.error("Gagal mengekspor data progress");
        return;
      }

      const data = await res.json();

      const chapterRows = [
        ["Chapter", "Progress (%)", "Lessons Selesai", "Tantangan Selesai", "Waktu Belajar (menit)", "Total Poin"],
        ...data.chapters.map((ch: { name: string; progress: number; lessonsCompleted: number; totalLessons: number; challengesCompleted: number; totalChallenges: number; timeSpent: number; totalPoints: number }) => [
          `"${ch.name}"`,
          ch.progress,
          `${ch.lessonsCompleted}/${ch.totalLessons}`,
          `${ch.challengesCompleted}/${ch.totalChallenges}`,
          ch.timeSpent,
          ch.totalPoints,
        ]),
      ];

      const header = [
        `Nama,${data.name ?? data.username}`,
        `Username,${data.username}`,
        `Progress Keseluruhan,${data.overallPercent}%`,
        `Terakhir Aktif,${data.lastActive ? new Date(data.lastActive).toLocaleDateString("id-ID") : "-"}`,
        `Diekspor Pada,${new Date().toLocaleDateString("id-ID")}`,
        "",
      ];

      const csvParts = [
        ...header,
        chapterRows.map((r) => r.join(",")).join("\n"),
      ];

      if (data.challengeAttempts?.length > 0) {
        const attemptRows = [
          "",
          ["Tantangan", "Kesulitan", "Skor", "Maks Poin", "Status", "Waktu (menit)", "Tanggal"].join(","),
          ...data.challengeAttempts.map((a: { challenge: string; difficulty: string; score: number; maxPoints: number; status: string; timeSpent: number; date: string }) =>
            [`"${a.challenge}"`, a.difficulty, a.score, a.maxPoints, a.status, a.timeSpent, a.date].join(",")
          ),
        ];
        csvParts.push(attemptRows.join("\n"));
      }

      const csv = csvParts.join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `progress-${data.username}-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("Progress berhasil diekspor!");
    } catch {
      toast.error("Terjadi kesalahan saat mengekspor progress");
    } finally {
      setExporting(false);
    }
  }, []);

  const stats = useMemo(() => {
    const totalLessons = progressData.reduce((s, ch) => s + ch.totalLessons, 0);
    const completedLessons = progressData.reduce((s, ch) => s + ch.completedLessons, 0);
    const completedChapters = progressData.filter((ch) => ch.status === "completed").length;
    const totalChapters = progressData.length;
    const overallPercent =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      totalLessons,
      completedLessons,
      completedChapters,
      totalChapters,
      overallPercent,
    };
  }, [progressData]);

  if (progressData.length === 0) return null;

  const statItems = [
    {
      icon: BookOpen,
      value: `${stats.completedLessons}/${stats.totalLessons}`,
      label: "Pelajaran Selesai",
      color: "text-blue-400",
      bg: "bg-blue-500/20",
    },
    {
      icon: GraduationCap,
      value: `${stats.completedChapters}/${stats.totalChapters}`,
      label: "Chapter Selesai",
      color: "text-emerald-400",
      bg: "bg-emerald-500/20",
    },
    {
      icon: Trophy,
      value: `${stats.overallPercent}%`,
      label: "Total Progress",
      color: "text-amber-400",
      bg: "bg-amber-500/20",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="px-4 lg:px-6"
    >
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
              <BarChart3 className="size-5" />
              Progress Keseluruhan
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExportCSV}
              disabled={exporting}
              className="h-8 gap-1.5 text-white/80 hover:text-white hover:bg-white/15"
            >
              {exporting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Download className="size-4" />
              )}
              <span className="hidden sm:inline">Ekspor Progress</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/80">Kemajuan Belajar</span>
              <span className="font-semibold">{stats.overallPercent}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-300"
                initial={{ width: 0 }}
                animate={{ width: `${stats.overallPercent}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {statItems.map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex items-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm"
              >
                <div className={`rounded-lg ${item.bg} p-2`}>
                  <item.icon className={`size-5 ${item.color}`} />
                </div>
                <div>
                  <div className="text-lg font-bold leading-tight">{item.value}</div>
                  <div className="text-xs text-white/70">{item.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Motivational message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="text-center text-sm font-medium text-white/90"
          >
            {getMotivationalMessage(stats.overallPercent)}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
