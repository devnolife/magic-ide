"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Upload,
  UserPlus,
  Trash2,
  Search,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  School,
  X,
  Download,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Student {
  id: string;
  username: string;
  email: string;
  name: string | null;
  joinedAt: string;
}

interface Classroom {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  students: Student[];
}

interface ProgressRow {
  userId: string;
  username: string;
  name: string | null;
  completionPercentage: number;
  totalPoints: number;
  chapters: Record<
    string,
    { completionPercentage: number; points: number; status: string }
  >;
}

interface UploadResult {
  created: number;
  skipped: number;
  errors: number;
  details?: string[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("auth-token");
  return { Authorization: `Bearer ${token}` };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ClassroomDetailPage() {
  const params = useParams();
  const classroomId = params.id as string;

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("students");

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Add-student dialog
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingStudent, setAddingStudent] = useState<string | null>(null);

  // Remove-student
  const [removingStudent, setRemovingStudent] = useState<string | null>(null);

  /* ---------- data fetchers ---------- */

  const fetchClassroom = useCallback(async () => {
    try {
      const res = await fetch(`/api/classrooms/${classroomId}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setClassroom(data.classroom ?? data);
      }
    } catch (err) {
      console.error("Failed to fetch classroom:", err);
    }
  }, [classroomId]);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await fetch(`/api/classrooms/${classroomId}/progress`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setProgress(Array.isArray(data) ? data : (data.progress ?? []));
      }
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    }
  }, [classroomId]);

  useEffect(() => {
    Promise.all([fetchClassroom(), fetchProgress()]).finally(() =>
      setLoading(false)
    );
  }, [fetchClassroom, fetchProgress]);

  /* ---------- student actions ---------- */

  const handleRemoveStudent = async (studentId: string) => {
    if (!confirm("Yakin ingin menghapus murid ini dari kelas?")) return;
    setRemovingStudent(studentId);
    try {
      const token = localStorage.getItem("auth-token");
      const res = await fetch(`/api/classrooms/${classroomId}/students`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId }),
      });
      if (res.ok) await fetchClassroom();
    } catch (err) {
      console.error("Remove student failed:", err);
    } finally {
      setRemovingStudent(null);
    }
  };

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const token = localStorage.getItem("auth-token");
      const res = await fetch(
        `/api/classrooms?searchUsers=${encodeURIComponent(searchQuery.trim())}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    } finally {
      setSearching(false);
    }
  };

  const handleAddStudent = async (studentId: string) => {
    setAddingStudent(studentId);
    try {
      const token = localStorage.getItem("auth-token");
      const res = await fetch(`/api/classrooms/${classroomId}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ studentId }),
      });
      if (res.ok) {
        await fetchClassroom();
        setAddDialogOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    } catch (err) {
      console.error("Add student failed:", err);
    } finally {
      setAddingStudent(null);
    }
  };

  /* ---------- file upload ---------- */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setUploadResult(null);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setUploadResult(null);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("auth-token");
      const res = await fetch(`/api/classrooms/${classroomId}/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        const result: UploadResult = await res.json();
        setUploadResult(result);
        setFile(null);
        // Reset file input
        const input = document.getElementById("excel-upload") as HTMLInputElement;
        if (input) input.value = "";
        await fetchClassroom();
      } else {
        const err = await res.json();
        setUploadError(err.error || "Upload gagal.");
      }
    } catch {
      setUploadError("Terjadi kesalahan jaringan.");
    } finally {
      setUploading(false);
    }
  };

  /* ---------- render helpers ---------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto" />
          <p className="mt-4 text-gray-500">Memuat detail kelas...</p>
        </div>
      </div>
    );
  }

  if (!classroom) {
    return (
      <div className="text-center py-20 space-y-4">
        <School className="h-16 w-16 text-gray-300 mx-auto" />
        <h2 className="text-xl font-bold text-gray-800">Kelas Tidak Ditemukan</h2>
        <Link href="/teacher/classrooms">
          <Button variant="outline">Kembali ke Daftar Kelas</Button>
        </Link>
      </div>
    );
  }

  const chapterKeys = Array.from(
    new Set(progress.flatMap((p) => Object.keys(p.chapters ?? {})))
  ).sort();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Back link */}
      <Link
        href="/teacher/classrooms"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Kelas
      </Link>

      {/* Classroom header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
            {classroom.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {classroom.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              {classroom.description || "Tidak ada deskripsi"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">
            <Users className="h-3 w-3 mr-1" />
            {classroom.students.length} murid
          </Badge>
          <Badge variant="outline" className="text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(classroom.createdAt)}
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="students" className="gap-1.5">
            <Users className="h-4 w-4" />
            Daftar Murid
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-1.5">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="upload" className="gap-1.5">
            <Upload className="h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>

        {/* ========== STUDENTS TAB ========== */}
        <TabsContent value="students" className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">Daftar Murid</h2>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Tambah Murid
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Murid ke Kelas</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Cari nama atau username..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearchUsers()}
                    />
                    <Button
                      onClick={handleSearchUsers}
                      disabled={searching}
                      variant="secondary"
                    >
                      {searching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {searchResults.length > 0 && (
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {searchResults.map((u) => {
                        const alreadyInClass = classroom.students.some(
                          (s) => s.id === u.id
                        );
                        return (
                          <div
                            key={u.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div>
                              <p className="font-medium text-sm">
                                {u.name || u.username}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                @{u.username} · {u.email}
                              </p>
                            </div>
                            {alreadyInClass ? (
                              <Badge variant="secondary" className="text-xs">
                                Sudah terdaftar
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                disabled={addingStudent === u.id}
                                onClick={() => handleAddStudent(u.id)}
                              >
                                {addingStudent === u.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  "Tambah"
                                )}
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {searchResults.length === 0 && searchQuery && !searching && (
                    <p className="text-sm text-center text-muted-foreground py-4">
                      Tidak ditemukan pengguna.
                    </p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {classroom.students.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-muted-foreground">
                    <th className="p-3 pr-4 font-medium">Nama</th>
                    <th className="p-3 pr-4 font-medium">Username</th>
                    <th className="p-3 pr-4 font-medium hidden sm:table-cell">
                      Email
                    </th>
                    <th className="p-3 pr-4 font-medium hidden md:table-cell">
                      Bergabung
                    </th>
                    <th className="p-3 font-medium w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {classroom.students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3 pr-4 font-medium text-foreground">
                        {student.name || "-"}
                      </td>
                      <td className="p-3 pr-4 text-muted-foreground">
                        @{student.username}
                      </td>
                      <td className="p-3 pr-4 text-muted-foreground hidden sm:table-cell">
                        {student.email}
                      </td>
                      <td className="p-3 pr-4 text-muted-foreground hidden md:table-cell">
                        {formatDate(student.joinedAt)}
                      </td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={removingStudent === student.id}
                          onClick={() => handleRemoveStudent(student.id)}
                        >
                          {removingStudent === student.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Users className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">Belum ada murid di kelas ini.</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Tambah murid secara manual atau upload file Excel.
              </p>
            </div>
          )}
        </TabsContent>

        {/* ========== PROGRESS TAB ========== */}
        <TabsContent value="progress" className="mt-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Progress Murid</h2>
            <p className="text-sm text-muted-foreground">
              Perkembangan belajar setiap murid per chapter
            </p>
          </div>

          {progress.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-muted-foreground">
                    <th className="p-3 pr-4 font-medium sticky left-0 bg-muted/40">
                      Murid
                    </th>
                    {chapterKeys.map((ch) => (
                      <th
                        key={ch}
                        className="p-3 font-medium text-center whitespace-nowrap"
                      >
                        {ch}
                      </th>
                    ))}
                    <th className="p-3 font-medium text-center">Total</th>
                    <th className="p-3 font-medium text-center">Poin</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.map((row) => (
                    <tr
                      key={row.userId}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3 pr-4 sticky left-0 bg-background">
                        <p className="font-medium text-foreground">
                          {row.name || row.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{row.username}
                        </p>
                      </td>
                      {chapterKeys.map((ch) => {
                        const chData = row.chapters?.[ch];
                        const pct = chData?.completionPercentage ?? 0;
                        return (
                          <td key={ch} className="p-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span
                                className={`text-xs font-semibold ${
                                  pct >= 100
                                    ? "text-green-600"
                                    : pct > 0
                                      ? "text-blue-600"
                                      : "text-muted-foreground"
                                }`}
                              >
                                {pct}%
                              </span>
                              <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    pct >= 100
                                      ? "bg-green-500"
                                      : pct > 0
                                        ? "bg-blue-500"
                                        : "bg-muted"
                                  }`}
                                  style={{ width: `${Math.min(pct, 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        );
                      })}
                      <td className="p-3 text-center">
                        <Badge
                          variant={
                            row.completionPercentage >= 100
                              ? "default"
                              : "secondary"
                          }
                          className={
                            row.completionPercentage >= 100
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {row.completionPercentage}%
                        </Badge>
                      </td>
                      <td className="p-3 text-center font-semibold text-emerald-700">
                        {row.totalPoints}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <TrendingUp className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground">Belum ada data progress.</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Data akan muncul setelah murid mulai belajar.
              </p>
            </div>
          )}
        </TabsContent>

        {/* ========== UPLOAD TAB ========== */}
        <TabsContent value="upload" className="mt-4 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
              Upload Data Murid
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload file Excel (.xlsx / .xls) berisi data murid untuk
              ditambahkan ke kelas ini.
            </p>
          </div>

          {/* File input */}
          <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-emerald-400 transition-colors">
            <Upload className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground mb-2 text-sm">
              Pilih file Excel untuk diupload
            </p>
            <input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="block mx-auto text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-100 file:text-emerald-700 file:font-medium hover:file:bg-emerald-200 file:cursor-pointer cursor-pointer"
            />
          </div>

          {/* Selected file info */}
          {file && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200"
            >
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-emerald-800">
                    {file.name}
                  </p>
                  <p className="text-xs text-emerald-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setFile(null);
                    const input = document.getElementById(
                      "excel-upload"
                    ) as HTMLInputElement;
                    if (input) input.value = "";
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-1" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Upload result */}
          {uploadResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Hasil Upload
              </h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-green-50 rounded-lg text-center border border-green-200">
                  <p className="text-2xl font-bold text-green-700">
                    {uploadResult.created}
                  </p>
                  <p className="text-xs text-green-600">Berhasil</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg text-center border border-yellow-200">
                  <p className="text-2xl font-bold text-yellow-700">
                    {uploadResult.skipped}
                  </p>
                  <p className="text-xs text-yellow-600">Dilewati</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center border border-red-200">
                  <p className="text-2xl font-bold text-red-700">
                    {uploadResult.errors}
                  </p>
                  <p className="text-xs text-red-600">Gagal</p>
                </div>
              </div>
              {uploadResult.details && uploadResult.details.length > 0 && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Detail:
                  </p>
                  {uploadResult.details.map((d, i) => (
                    <p key={i} className="text-xs text-muted-foreground">
                      {d}
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {uploadError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-sm text-red-700 border border-red-200"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {uploadError}
            </motion.div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              📋 Format File Excel
            </h4>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside mb-3">
              <li>Kolom wajib: <strong>username</strong>, <strong>email</strong>, <strong>password</strong></li>
              <li>Kolom opsional: <strong>name</strong></li>
              <li>Baris pertama adalah header</li>
              <li>Format: .xlsx atau .xls</li>
            </ul>
            <a href="/asset/template-upload-murid.xlsx" download>
              <Button variant="outline" size="sm" className="text-blue-700 border-blue-300 hover:bg-blue-100">
                <Download className="h-4 w-4 mr-2" />
                Download Template Excel
              </Button>
            </a>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

