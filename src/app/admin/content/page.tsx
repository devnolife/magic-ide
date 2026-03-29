"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

      const chaptersData = chaptersRes.ok ? await chaptersRes.json() : [];
      const lessonsData = lessonsRes.ok ? await lessonsRes.json() : [];
      const quizzesData = quizzesRes.ok ? await quizzesRes.json() : [];

      setStats({
        chapters: Array.isArray(chaptersData) ? chaptersData.length : 0,
        lessons: Array.isArray(lessonsData) ? lessonsData.length : 0,
        quizzes: Array.isArray(quizzesData) ? quizzesData.length : 0,
      });
    } catch {
      console.error("Gagal memuat statistik konten");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  }

  const sections = [
    {
      title: "Bab",
      description: "Kelola bab-bab pembelajaran Python",
      count: stats.chapters,
      icon: BookOpen,
      color: "purple",
      href: "/admin/content/chapters",
      bg: "bg-purple-50",
      border: "border-purple-200",
      iconColor: "text-purple-600",
      badgeBg: "bg-purple-100 text-purple-700",
    },
    {
      title: "Pelajaran",
      description: "Kelola materi pelajaran dalam setiap bab",
      count: stats.lessons,
      icon: FileText,
      color: "blue",
      href: "/admin/content/lessons",
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconColor: "text-blue-600",
      badgeBg: "bg-blue-100 text-blue-700",
    },
    {
      title: "Kuis",
      description: "Kelola kuis dan soal-soal latihan",
      count: stats.quizzes,
      icon: FileQuestion,
      color: "green",
      href: "/admin/content/quizzes",
      bg: "bg-green-50",
      border: "border-green-200",
      iconColor: "text-green-600",
      badgeBg: "bg-green-100 text-green-700",
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manajemen Konten</h1>
        <p className="text-gray-600 mt-1">Kelola semua materi pembelajaran platform</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className={`${s.border} ${s.bg}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`h-10 w-10 ${s.iconColor}`} />
                  <Badge className={s.badgeBg}>{s.count} total</Badge>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{s.description}</p>
                <div className="flex gap-2">
                  <Link href={s.href}>
                    <Button variant="outline" size="sm">
                      Kelola <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href={s.title === "Kuis" ? "/admin/content/quizzes/new" : s.href}>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                      <Plus className="h-4 w-4 mr-1" /> Tambah
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Aksi Cepat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/admin/content/chapters">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
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
              <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Buat Kuis Baru
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
