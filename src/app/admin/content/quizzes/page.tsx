"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileQuestion,
  Plus,
  Pencil,
  Loader2,
  Filter,
  ToggleLeft,
  ToggleRight,
  Clock,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Chapter {
  id: string;
  number: number;
  title: string;
}

interface Quiz {
  id: string;
  title: string;
  description?: string;
  chapterId: string;
  timeLimit?: number;
  isActive?: boolean;
  chapter?: Chapter;
  _count?: { questions: number };
}

export default function QuizzesPage() {
  const { user } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterChapter, setFilterChapter] = useState("");

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("auth-token");
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const h = getHeaders();
      const [chapRes, quizRes] = await Promise.all([
        fetch("/api/admin/chapters", { headers: h }),
        fetch(`/api/admin/quizzes${filterChapter ? `?chapterId=${filterChapter}` : ""}`, { headers: h }),
      ]);
      if (chapRes.ok) {
        const d = await chapRes.json();
        const list = d.chapters ?? d;
        setChapters(Array.isArray(list) ? list : []);
      }
      if (quizRes.ok) {
        const d = await quizRes.json();
        const list = d.quizzes ?? d;
        setQuizzes(Array.isArray(list) ? list : []);
      }
    } catch {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [getHeaders, filterChapter]);

  useEffect(() => {
    if (user?.role === "ADMIN") fetchData();
  }, [user, fetchData]);

  const toggleActive = async (quiz: Quiz) => {
    try {
      const res = await fetch(`/api/admin/quizzes/${quiz.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ isActive: !quiz.isActive }),
      });
      if (res.ok) {
        setQuizzes((prev) =>
          prev.map((q) => (q.id === quiz.id ? { ...q, isActive: !q.isActive } : q))
        );
        toast.success(`Kuis ${!quiz.isActive ? "diaktifkan" : "dinonaktifkan"}`);
      }
    } catch {
      toast.error("Gagal mengubah status");
    }
  };

  const chapterName = (id: string) => chapters.find((c) => c.id === id)?.title || id;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manajemen Kuis</h1>
          <p className="text-muted-foreground">Kelola kuis dan soal-soal latihan</p>
        </div>
        <Link href="/admin/content/quizzes/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" /> Buat Kuis Baru
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <label className="text-sm font-medium text-foreground">Filter Bab:</label>
        <select
          className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={filterChapter}
          onChange={(e) => setFilterChapter(e.target.value)}
        >
          <option value="">Semua Bab</option>
          {chapters.sort((a, b) => a.number - b.number).map((c) => (
            <option key={c.id} value={c.id}>Bab {c.number}: {c.title}</option>
          ))}
        </select>
      </div>

      {/* Quiz List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileQuestion className="h-5 w-5" />
          Daftar Kuis ({quizzes.length})
        </h2>
        {quizzes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground rounded-lg border">
            <FileQuestion className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="mb-3">Belum ada kuis{filterChapter ? " di bab ini" : ""}.</p>
            <Link href="/admin/content/quizzes/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Buat Kuis Pertama
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground bg-muted/50">
                  <th className="py-3 px-3 font-medium">Judul</th>
                  <th className="py-3 px-3 font-medium">Bab</th>
                  <th className="py-3 px-3 font-medium text-center">Soal</th>
                  <th className="py-3 px-3 font-medium text-center">Waktu</th>
                  <th className="py-3 px-3 font-medium text-center">Status</th>
                  <th className="py-3 px-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((quiz) => (
                  <tr key={quiz.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-medium text-foreground">{quiz.title}</p>
                        {quiz.description && (
                          <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                            {quiz.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="secondary">
                        {quiz.chapter?.title || chapterName(quiz.chapterId)}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-foreground">
                        <HelpCircle className="h-3.5 w-3.5" />
                        {quiz._count?.questions ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {quiz.timeLimit ? (
                        <span className="inline-flex items-center gap-1 text-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {quiz.timeLimit} menit
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Tidak terbatas</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button onClick={() => toggleActive(quiz)}>
                        {quiz.isActive !== false ? (
                          <span className="inline-flex items-center gap-1 text-green-600">
                            <ToggleRight className="h-5 w-5" />
                            <span className="text-xs">Aktif</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <ToggleLeft className="h-5 w-5" />
                            <span className="text-xs">Nonaktif</span>
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex justify-end">
                        <Link href={`/admin/content/quizzes/${quiz.id}`}>
                          <Button variant="ghost" size="sm">
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
