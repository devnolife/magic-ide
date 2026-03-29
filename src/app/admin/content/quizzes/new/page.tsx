"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FileQuestion,
  Plus,
  Trash2,
  Loader2,
  Save,
  ArrowUp,
  ArrowDown,
  GripVertical,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";

interface Chapter {
  id: string;
  number: number;
  title: string;
}

interface Option {
  label: string;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id?: string;
  questionText: string;
  questionType: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "CODING" | "SHORT_ANSWER";
  points: number;
  options: Option[];
  correctAnswer: string;
}

const QUESTION_TYPES = [
  { value: "MULTIPLE_CHOICE", label: "Pilihan Ganda" },
  { value: "TRUE_FALSE", label: "Benar/Salah" },
  { value: "CODING", label: "Koding" },
  { value: "SHORT_ANSWER", label: "Jawaban Singkat" },
] as const;

const emptyQuestion: Question = {
  questionText: "",
  questionType: "MULTIPLE_CHOICE",
  points: 10,
  options: [
    { label: "A", text: "", isCorrect: true },
    { label: "B", text: "", isCorrect: false },
    { label: "C", text: "", isCorrect: false },
    { label: "D", text: "", isCorrect: false },
  ],
  correctAnswer: "",
};

export default function NewQuizPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [timeLimit, setTimeLimit] = useState<number | "">("");
  const [questions, setQuestions] = useState<Question[]>([{ ...emptyQuestion }]);

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("auth-token");
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  }, []);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    (async () => {
      try {
        const res = await fetch("/api/admin/chapters", { headers: getHeaders() });
        if (res.ok) {
          const d = await res.json();
          setChapters(Array.isArray(d) ? d : []);
        }
      } catch {
        toast.error("Gagal memuat daftar bab");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, getHeaders]);

  const updateQuestion = (idx: number, updates: Partial<Question>) => {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, ...updates } : q)));
  };

  const updateOption = (qIdx: number, oIdx: number, updates: Partial<Option>) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const newOptions = q.options.map((o, j) => {
          if (j !== oIdx) return updates.isCorrect ? { ...o, isCorrect: false } : o;
          return { ...o, ...updates };
        });
        return { ...q, options: newOptions };
      })
    );
  };

  const addOption = (qIdx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const nextLabel = String.fromCharCode(65 + q.options.length);
        return { ...q, options: [...q.options, { label: nextLabel, text: "", isCorrect: false }] };
      })
    );
  };

  const removeOption = (qIdx: number, oIdx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx || q.options.length <= 2) return q;
        const newOptions = q.options.filter((_, j) => j !== oIdx).map((o, j) => ({
          ...o,
          label: String.fromCharCode(65 + j),
        }));
        return { ...q, options: newOptions };
      })
    );
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { ...emptyQuestion, options: emptyQuestion.options.map((o) => ({ ...o })) }]);
  };

  const removeQuestion = (idx: number) => {
    if (questions.length <= 1) {
      toast.error("Minimal harus ada 1 soal");
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveQuestion = (idx: number, direction: "up" | "down") => {
    const target = direction === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= questions.length) return;
    setQuestions((prev) => {
      const arr = [...prev];
      [arr[idx], arr[target]] = [arr[target], arr[idx]];
      return arr;
    });
  };

  const handleSave = async () => {
    if (!title.trim()) { toast.error("Judul kuis wajib diisi"); return; }
    if (!chapterId) { toast.error("Pilih bab terlebih dahulu"); return; }
    if (questions.some((q) => !q.questionText.trim())) {
      toast.error("Semua soal harus memiliki teks pertanyaan");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title,
        description,
        chapterId,
        timeLimit: timeLimit || null,
        questions: questions.map((q) => ({
          questionText: q.questionText,
          questionType: q.questionType,
          points: q.points,
          options: q.questionType === "MULTIPLE_CHOICE" ? JSON.stringify(q.options) : null,
          correctAnswer:
            q.questionType === "MULTIPLE_CHOICE"
              ? q.options.find((o) => o.isCorrect)?.label || "A"
              : q.correctAnswer,
        })),
      };

      const res = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Kuis berhasil dibuat!");
        router.push("/admin/content/quizzes");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Gagal menyimpan kuis");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/content/quizzes")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Kembali
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Buat Kuis Baru</h1>
          <p className="text-gray-600 mt-1">Rancang kuis dengan berbagai jenis soal</p>
        </div>
      </div>

      {/* Quiz Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-purple-600" />
            Informasi Kuis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Judul Kuis *</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Masukkan judul kuis" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Bab *</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={chapterId}
                onChange={(e) => setChapterId(e.target.value)}
              >
                <option value="">Pilih Bab</option>
                {chapters.sort((a, b) => a.number - b.number).map((c) => (
                  <option key={c.id} value={c.id}>Bab {c.number}: {c.title}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Deskripsi</label>
            <textarea
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[60px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi kuis (opsional)"
            />
          </div>
          <div className="max-w-xs">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Batas Waktu (menit, opsional)</label>
            <Input
              type="number"
              min={1}
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value ? parseInt(e.target.value) : "")}
              placeholder="Tidak terbatas"
            />
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {questions.map((q, qIdx) => (
          <Card key={qIdx} className="border-l-4 border-l-purple-400">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  Soal {qIdx + 1}
                  <Badge variant="secondary" className="text-xs">
                    {QUESTION_TYPES.find((t) => t.value === q.questionType)?.label}
                  </Badge>
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => moveQuestion(qIdx, "up")} disabled={qIdx === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveQuestion(qIdx, "down")}
                    disabled={qIdx === questions.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => removeQuestion(qIdx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Pertanyaan *</label>
                  <textarea
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[60px]"
                    value={q.questionText}
                    onChange={(e) => updateQuestion(qIdx, { questionText: e.target.value })}
                    placeholder="Tulis pertanyaan..."
                  />
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Tipe Soal</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={q.questionType}
                      onChange={(e) =>
                        updateQuestion(qIdx, { questionType: e.target.value as Question["questionType"] })
                      }
                    >
                      {QUESTION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Poin</label>
                    <Input
                      type="number"
                      min={1}
                      value={q.points}
                      onChange={(e) => updateQuestion(qIdx, { points: parseInt(e.target.value) || 10 })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Answers by type */}
              {q.questionType === "MULTIPLE_CHOICE" && (
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700">Pilihan Jawaban</label>
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex items-center gap-2">
                      <button
                        className={`flex items-center justify-center h-8 w-8 rounded-full border-2 shrink-0 transition-colors ${
                          opt.isCorrect
                            ? "border-green-500 bg-green-50 text-green-600"
                            : "border-gray-300 text-gray-400 hover:border-gray-400"
                        }`}
                        onClick={() => updateOption(qIdx, oIdx, { isCorrect: true })}
                        title="Tandai sebagai jawaban benar"
                      >
                        {opt.isCorrect ? <CheckCircle className="h-4 w-4" /> : opt.label}
                      </button>
                      <Input
                        className="flex-1"
                        value={opt.text}
                        onChange={(e) => updateOption(qIdx, oIdx, { text: e.target.value })}
                        placeholder={`Pilihan ${opt.label}`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 shrink-0"
                        onClick={() => removeOption(qIdx, oIdx)}
                        disabled={q.options.length <= 2}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => addOption(qIdx)}>
                    <Plus className="h-3.5 w-3.5 mr-1" /> Tambah Pilihan
                  </Button>
                </div>
              )}

              {q.questionType === "TRUE_FALSE" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Jawaban Benar</label>
                  <select
                    className="flex h-10 w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={q.correctAnswer}
                    onChange={(e) => updateQuestion(qIdx, { correctAnswer: e.target.value })}
                  >
                    <option value="">Pilih jawaban</option>
                    <option value="true">Benar (True)</option>
                    <option value="false">Salah (False)</option>
                  </select>
                </div>
              )}

              {(q.questionType === "CODING" || q.questionType === "SHORT_ANSWER") && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Jawaban Benar</label>
                  <textarea
                    className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[60px] ${
                      q.questionType === "CODING" ? "font-mono" : ""
                    }`}
                    value={q.correctAnswer}
                    onChange={(e) => updateQuestion(qIdx, { correctAnswer: e.target.value })}
                    placeholder={
                      q.questionType === "CODING"
                        ? "print('Hello, World!')"
                        : "Ketik jawaban yang benar"
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add question + Save */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={addQuestion}>
          <Plus className="h-4 w-4 mr-2" /> Tambah Soal
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/content/quizzes")}>
            Batal
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Simpan Kuis
          </Button>
        </div>
      </div>
    </div>
  );
}
