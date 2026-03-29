"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        setChapters(Array.isArray(d) ? d : []);
      }
      if (quizRes.ok) {
        const d = await quizRes.json();
        setQuizzes(Array.isArray(d) ? d : []);
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Kuis</h1>
          <p className="text-gray-600 mt-1">Kelola kuis dan soal-soal latihan</p>
        </div>
        <Link href="/admin/content/quizzes/new">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Plus className="h-4 w-4 mr-2" /> Buat Kuis Baru
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-gray-500" />
            <label className="text-sm font-medium text-gray-700">Filter Bab:</label>
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
        </CardContent>
      </Card>

      {/* Quiz List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-green-600" />
            Daftar Kuis ({quizzes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quizzes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileQuestion className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="mb-3">Belum ada kuis{filterChapter ? " di bab ini" : ""}.</p>
              <Link href="/admin/content/quizzes/new">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" /> Buat Kuis Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="py-3 px-2 font-medium">Judul</th>
                    <th className="py-3 px-2 font-medium">Bab</th>
                    <th className="py-3 px-2 font-medium text-center">Soal</th>
                    <th className="py-3 px-2 font-medium text-center">Waktu</th>
                    <th className="py-3 px-2 font-medium text-center">Status</th>
                    <th className="py-3 px-2 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-gray-900">{quiz.title}</p>
                          {quiz.description && (
                            <p className="text-xs text-gray-500 truncate max-w-[250px]">
                              {quiz.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="secondary">
                          {quiz.chapter?.title || chapterName(quiz.chapterId)}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="inline-flex items-center gap-1 text-gray-700">
                          <HelpCircle className="h-3.5 w-3.5" />
                          {quiz._count?.questions ?? 0}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        {quiz.timeLimit ? (
                          <span className="inline-flex items-center gap-1 text-gray-700">
                            <Clock className="h-3.5 w-3.5" />
                            {quiz.timeLimit} menit
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">Tidak terbatas</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <button onClick={() => toggleActive(quiz)}>
                          {quiz.isActive !== false ? (
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <ToggleRight className="h-5 w-5" />
                              <span className="text-xs">Aktif</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-gray-400">
                              <ToggleLeft className="h-5 w-5" />
                              <span className="text-xs">Nonaktif</span>
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-2">
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
        </CardContent>
      </Card>
    </div>
  );
}
