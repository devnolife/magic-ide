"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

interface Chapter {
  id: string;
  number: number;
  title: string;
}

interface Lesson {
  id: string;
  number: number;
  title: string;
  description?: string;
  content?: string;
  chapterId: string;
  isActive?: boolean;
  chapter?: Chapter;
}

interface LessonForm {
  chapterId: string;
  number: number;
  title: string;
  description: string;
  content: string;
}

const emptyForm: LessonForm = { chapterId: "", number: 1, title: "", description: "", content: "" };

export default function LessonsPage() {
  const { user } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterChapter, setFilterChapter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LessonForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("auth-token");
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const h = getHeaders();
      const [chapRes, lessRes] = await Promise.all([
        fetch("/api/admin/chapters", { headers: h }),
        fetch(`/api/admin/lessons${filterChapter ? `?chapterId=${filterChapter}` : ""}`, { headers: h }),
      ]);
      if (chapRes.ok) {
        const d = await chapRes.json();
        setChapters(Array.isArray(d) ? d : []);
      }
      if (lessRes.ok) {
        const d = await lessRes.json();
        setLessons(Array.isArray(d) ? d : []);
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

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.chapterId) {
      toast.error("Judul dan bab wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/lessons/${editingId}` : "/api/admin/lessons";
      const method = editingId ? "PUT" : "POST";
      const body: Record<string, unknown> = { ...form };
      if (form.content.trim()) {
        try {
          body.content = JSON.parse(form.content);
        } catch {
          body.content = form.content;
        }
      }
      const res = await fetch(url, { method, headers: getHeaders(), body: JSON.stringify(body) });
      if (res.ok) {
        toast.success(editingId ? "Pelajaran diperbarui" : "Pelajaran ditambahkan");
        resetForm();
        fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Gagal menyimpan");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/lessons/${id}`, { method: "DELETE", headers: getHeaders() });
      if (res.ok) {
        toast.success("Pelajaran dihapus");
        setLessons((prev) => prev.filter((l) => l.id !== id));
      } else {
        toast.error("Gagal menghapus");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    }
    setDeleteConfirm(null);
  };

  const toggleActive = async (lesson: Lesson) => {
    try {
      const res = await fetch(`/api/admin/lessons/${lesson.id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ isActive: !lesson.isActive }),
      });
      if (res.ok) {
        setLessons((prev) =>
          prev.map((l) => (l.id === lesson.id ? { ...l, isActive: !l.isActive } : l))
        );
        toast.success(`Pelajaran ${!lesson.isActive ? "diaktifkan" : "dinonaktifkan"}`);
      }
    } catch {
      toast.error("Gagal mengubah status");
    }
  };

  const startEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setForm({
      chapterId: lesson.chapterId,
      number: lesson.number,
      title: lesson.title,
      description: lesson.description || "",
      content: typeof lesson.content === "object" ? JSON.stringify(lesson.content, null, 2) : lesson.content || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
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
          <h1 className="text-2xl font-bold text-foreground">Manajemen Pelajaran</h1>
          <p className="text-muted-foreground">Kelola materi pelajaran di setiap bab</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Tambah Pelajaran
        </Button>
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={resetForm} />
          <div className="relative z-10 w-full max-w-xl max-h-[90vh] overflow-y-auto bg-background rounded-lg border shadow-lg">
            <div className="p-6 pb-3">
              <h3 className="text-lg font-semibold">{editingId ? "Edit Pelajaran" : "Tambah Pelajaran Baru"}</h3>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Bab</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={form.chapterId}
                  onChange={(e) => setForm({ ...form, chapterId: e.target.value })}
                >
                  <option value="">Pilih Bab</option>
                  {chapters.sort((a, b) => a.number - b.number).map((c) => (
                    <option key={c.id} value={c.id}>Bab {c.number}: {c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nomor Pelajaran</label>
                <Input
                  type="number"
                  min={1}
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Judul</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Judul pelajaran"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Deskripsi</label>
                <textarea
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[60px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi pelajaran"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Konten (JSON)</label>
                <textarea
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[120px]"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder='{"sections": [...]}'
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={resetForm}>Batal</Button>
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingId ? "Simpan Perubahan" : "Tambah Pelajaran"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative z-10 w-full max-w-sm bg-background rounded-lg border shadow-lg p-6 text-center">
            <Trash2 className="h-12 w-12 text-destructive mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Hapus Pelajaran?</h3>
            <p className="text-sm text-muted-foreground mb-4">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Batal</Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>Hapus</Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Daftar Pelajaran ({lessons.length})
        </h2>
        {lessons.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground rounded-lg border">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p>Belum ada pelajaran{filterChapter ? " di bab ini" : ""}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground bg-muted/50">
                  <th className="py-3 px-3 font-medium">No</th>
                  <th className="py-3 px-3 font-medium">Judul</th>
                  <th className="py-3 px-3 font-medium">Bab</th>
                  <th className="py-3 px-3 font-medium text-center">Status</th>
                  <th className="py-3 px-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {lessons
                  .sort((a, b) => a.number - b.number)
                  .map((lesson) => (
                    <tr key={lesson.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-3 font-mono text-muted-foreground">{lesson.number}</td>
                      <td className="py-3 px-3 font-medium text-foreground">{lesson.title}</td>
                      <td className="py-3 px-3">
                        <Badge variant="secondary">{lesson.chapter?.title || chapterName(lesson.chapterId)}</Badge>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button onClick={() => toggleActive(lesson)}>
                          {lesson.isActive !== false ? (
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
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => startEdit(lesson)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteConfirm(lesson.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
