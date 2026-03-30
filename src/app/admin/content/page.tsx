"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileText,
  FileQuestion,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface ContentStats {
  chapters: number;
  lessons: number;
  quizzes: number;
}

export default function ContentOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<ContentStats>({ chapters: 0, lessons: 0, quizzes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const headers = { Authorization: `Bearer ${token}` };

      const [chaptersRes, lessonsRes, quizzesRes] = await Promise.all([
        fetch("/api/admin/chapters", { headers }),
        fetch("/api/admin/lessons", { headers }),
        fetch("/api/admin/quizzes", { headers }),
      ]);

      const chaptersData = chaptersRes.ok ? await chaptersRes.json() : {};
      const lessonsData = lessonsRes.ok ? await lessonsRes.json() : {};
      const quizzesData = quizzesRes.ok ? await quizzesRes.json() : {};

      const chArr = chaptersData.chapters ?? chaptersData;
      const lArr = lessonsData.lessons ?? lessonsData;
      const qArr = quizzesData.quizzes ?? quizzesData;

      setStats({
        chapters: Array.isArray(chArr) ? chArr.length : 0,
        lessons: Array.isArray(lArr) ? lArr.length : 0,
        quizzes: Array.isArray(qArr) ? qArr.length : 0,
      });
    } catch {
      console.error("Gagal memuat statistik konten");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  const sections = [
    {
      title: "Bab",
      description: "Kelola bab-bab pembelajaran Python",
      count: stats.chapters,
      icon: BookOpen,
      href: "/admin/content/chapters",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Pelajaran",
      description: "Kelola materi pelajaran dalam setiap bab",
      count: stats.lessons,
      icon: FileText,
      href: "/admin/content/lessons",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Kuis",
      description: "Kelola kuis dan soal-soal latihan",
      count: stats.quizzes,
      icon: FileQuestion,
      href: "/admin/content/quizzes",
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manajemen Konten</h1>
        <p className="text-muted-foreground">Kelola semua materi pembelajaran platform</p>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="rounded-lg border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-lg ${s.bg}`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <Badge variant="secondary">{s.count} total</Badge>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
              <div className="flex gap-2">
                <Link href={s.href}>
                  <Button variant="outline" size="sm">
                    Kelola <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
                <Link href={s.title === "Kuis" ? "/admin/content/quizzes/new" : s.href}>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Tambah
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/admin/content/chapters">
            <Button variant="outline" className="w-full justify-start">
              <BookOpen className="h-4 w-4 mr-2 text-emerald-600" />
              Lihat Semua Bab
            </Button>
          </Link>
          <Link href="/admin/content/lessons">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2 text-blue-600" />
              Lihat Semua Pelajaran
            </Button>
          </Link>
          <Link href="/admin/content/quizzes">
            <Button variant="outline" className="w-full justify-start">
              <FileQuestion className="h-4 w-4 mr-2 text-green-600" />
              Lihat Semua Kuis
            </Button>
          </Link>
          <Link href="/admin/content/quizzes/new">
            <Button className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Buat Kuis Baru
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
