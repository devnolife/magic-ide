"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";

interface Chapter {
  id: string;
  number: number;
  title: string;
  description?: string;
  isActive?: boolean;
  _count?: { lessons: number; quizzes: number };
}

interface ChapterForm {
  number: number;
  title: string;
  description: string;
}

const emptyForm: ChapterForm = { number: 0, title: "", description: "" };

export default function ChaptersPage() {
  const { user } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ChapterForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const headers = useCallback(() => {
    const token = localStorage.getItem("auth-token");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const fetchChapters = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/chapters", { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        setChapters(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("Gagal memuat data bab");
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    if (user?.role === "ADMIN") fetchChapters();
  }, [user, fetchChapters]);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Judul bab wajib diisi");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/chapters/${editingId}` : "/api/admin/chapters";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: headers(),
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editingId ? "Bab berhasil diperbarui" : "Bab berhasil ditambahkan");
        resetForm();
        fetchChapters();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Gagal menyimpan bab");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/chapters/${id}`, {
        method: "DELETE",
        headers: headers(),
      });
      if (res.ok) {
        toast.success("Bab berhasil dihapus");
        setChapters((prev) => prev.filter((c) => c.id !== id));
      } else {
        toast.error("Gagal menghapus bab");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    }
    setDeleteConfirm(null);
  };

  const toggleActive = async (chapter: Chapter) => {
    try {
      const res = await fetch(`/api/admin/chapters/${chapter.id}`, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify({ isActive: !chapter.isActive }),
      });
      if (res.ok) {
        setChapters((prev) =>
          prev.map((c) => (c.id === chapter.id ? { ...c, isActive: !c.isActive } : c))
        );
        toast.success(`Bab ${!chapter.isActive ? "diaktifkan" : "dinonaktifkan"}`);
      }
    } catch {
      toast.error("Gagal mengubah status");
    }
  };

  const startEdit = (chapter: Chapter) => {
    setEditingId(chapter.id);
    setForm({
      number: chapter.number,
      title: chapter.title,
      description: chapter.description || "",
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

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
          <h1 className="text-2xl font-bold text-foreground">Manajemen Bab</h1>
          <p className="text-muted-foreground">Kelola bab-bab pembelajaran</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Tambah Bab
        </Button>
      </div>

      {/* Create / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={resetForm} />
          <div className="relative z-10 w-full max-w-lg bg-background rounded-lg border shadow-lg">
            <div className="p-6 pb-3">
              <h3 className="text-lg font-semibold">{editingId ? "Edit Bab" : "Tambah Bab Baru"}</h3>
            </div>
            <div className="px-6 pb-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Nomor Bab</label>
                <Input
                  type="number"
                  min={0}
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Judul</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Judul bab"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Deskripsi</label>
                <textarea
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[80px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Deskripsi singkat bab ini"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={resetForm}>
                  Batal
                </Button>
                <Button onClick={handleSubmit} disabled={saving}>
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingId ? "Simpan Perubahan" : "Tambah Bab"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setDeleteConfirm(null)} />
          <div className="relative z-10 w-full max-w-sm bg-background rounded-lg border shadow-lg p-6 text-center">
            <Trash2 className="h-12 w-12 text-destructive mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">Hapus Bab?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tindakan ini tidak dapat dibatalkan. Semua pelajaran dan kuis terkait mungkin terpengaruh.
            </p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Daftar Bab ({chapters.length})
        </h2>
        {chapters.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground rounded-lg border">
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p>Belum ada bab. Klik &quot;Tambah Bab&quot; untuk memulai.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground bg-muted/50">
                  <th className="py-3 px-3 font-medium">No</th>
                  <th className="py-3 px-3 font-medium">Judul</th>
                  <th className="py-3 px-3 font-medium">Deskripsi</th>
                  <th className="py-3 px-3 font-medium text-center">Pelajaran</th>
                  <th className="py-3 px-3 font-medium text-center">Kuis</th>
                  <th className="py-3 px-3 font-medium text-center">Status</th>
                  <th className="py-3 px-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {chapters
                  .sort((a, b) => a.number - b.number)
                  .map((chapter) => (
                    <tr key={chapter.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-3 font-mono text-muted-foreground">{chapter.number}</td>
                      <td className="py-3 px-3 font-medium text-foreground">{chapter.title}</td>
                      <td className="py-3 px-3 text-muted-foreground max-w-[200px] truncate">
                        {chapter.description || "—"}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant="secondary">{chapter._count?.lessons ?? 0}</Badge>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant="secondary">{chapter._count?.quizzes ?? 0}</Badge>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button onClick={() => toggleActive(chapter)} title="Toggle status">
                          {chapter.isActive !== false ? (
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
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(chapter)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteConfirm(chapter.id)}
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
