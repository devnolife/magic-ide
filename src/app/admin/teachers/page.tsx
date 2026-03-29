"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  UserPlus,
  Loader2,
  Users,
  School,
  Search,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";

interface UserItem {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  _count?: {
    classrooms?: number;
    progress?: number;
  };
}

export default function TeachersPage() {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<UserItem[]>([]);
  const [allUsers, setAllUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPromote, setShowPromote] = useState(false);
  const [search, setSearch] = useState("");
  const [promoting, setPromoting] = useState<string | null>(null);

  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("auth-token");
    return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const h = getHeaders();
      const res = await fetch("/api/admin/users?limit=200", { headers: h });
      if (res.ok) {
        const data = await res.json();
        const users: UserItem[] = data.users || [];
        setTeachers(users.filter((u) => u.role === "TEACHER"));
        setAllUsers(users);
      }
    } catch {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    if (user?.role === "ADMIN") fetchData();
  }, [user, fetchData]);

  const promoteToTeacher = async (userId: string) => {
    setPromoting(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ userId, role: "TEACHER" }),
      });
      if (res.ok) {
        toast.success("Pengguna berhasil dijadikan guru");
        fetchData();
        setShowPromote(false);
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Gagal mengubah peran");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setPromoting(null);
    }
  };

  const demoteToUser = async (userId: string) => {
    setPromoting(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ userId, role: "USER" }),
      });
      if (res.ok) {
        toast.success("Peran guru dicabut");
        fetchData();
      } else {
        toast.error("Gagal mengubah peran");
      }
    } catch {
      toast.error("Terjadi kesalahan");
    } finally {
      setPromoting(null);
    }
  };

  const eligibleUsers = allUsers.filter(
    (u) =>
      u.role === "USER" &&
      u.isActive &&
      (search === "" ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

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
          <h1 className="text-2xl font-bold text-foreground">Manajemen Guru</h1>
          <p className="text-muted-foreground">Kelola akun guru dan kelas mereka</p>
        </div>
        <Button onClick={() => setShowPromote(true)}>
          <UserPlus className="h-4 w-4 mr-2" /> Tambah Guru
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 rounded-lg border p-4">
          <div className="p-2.5 rounded-lg bg-green-100">
            <GraduationCap className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Guru</p>
            <p className="text-2xl font-bold text-foreground">{teachers.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-lg border p-4">
          <div className="p-2.5 rounded-lg bg-blue-100">
            <School className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Kelas</p>
            <p className="text-2xl font-bold text-foreground">
              {teachers.reduce((acc, t) => acc + (t._count?.classrooms || 0), 0)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-lg border p-4">
          <div className="p-2.5 rounded-lg bg-emerald-100">
            <Users className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Pengguna</p>
            <p className="text-2xl font-bold text-foreground">{allUsers.length}</p>
          </div>
        </div>
      </div>

      {/* Promote Modal */}
      {showPromote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowPromote(false)} />
          <div className="relative z-10 w-full max-w-lg max-h-[80vh] flex flex-col bg-background rounded-lg border shadow-lg">
            <div className="p-6 pb-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Promosi Pengguna Menjadi Guru
              </h3>
            </div>
            <div className="px-6 pb-6 flex-1 overflow-hidden flex flex-col">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Cari pengguna..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex-1 overflow-y-auto divide-y max-h-[400px] rounded-lg border">
                {eligibleUsers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-6">
                    {search ? "Tidak ditemukan pengguna yang cocok" : "Tidak ada pengguna yang dapat dipromosikan"}
                  </p>
                ) : (
                  eligibleUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-3"
                    >
                      <div>
                        <p className="font-medium text-sm text-foreground">{u.name || u.username}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => promoteToTeacher(u.id)}
                        disabled={promoting === u.id}
                      >
                        {promoting === u.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4 mr-1" /> Jadikan Guru
                          </>
                        )}
                      </Button>
                    </div>
                  ))
                )}
              </div>
              <div className="pt-3 mt-3 border-t">
                <Button variant="outline" className="w-full" onClick={() => setShowPromote(false)}>
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teachers Table */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Daftar Guru ({teachers.length})
        </h2>
        {teachers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground rounded-lg border">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="mb-3">Belum ada guru terdaftar.</p>
            <Button onClick={() => setShowPromote(true)}>
              <UserPlus className="h-4 w-4 mr-2" /> Tambah Guru Pertama
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground bg-muted/50">
                  <th className="py-3 px-3 font-medium">Nama</th>
                  <th className="py-3 px-3 font-medium">Username</th>
                  <th className="py-3 px-3 font-medium">Email</th>
                  <th className="py-3 px-3 font-medium text-center">Kelas</th>
                  <th className="py-3 px-3 font-medium text-center">Status</th>
                  <th className="py-3 px-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-3 font-medium text-foreground">
                      {teacher.name || "—"}
                    </td>
                    <td className="py-3 px-3 text-muted-foreground">{teacher.username}</td>
                    <td className="py-3 px-3 text-muted-foreground">{teacher.email}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant="secondary">
                        <School className="h-3 w-3 mr-1" />
                        {teacher._count?.classrooms ?? 0}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant={teacher.isActive ? "default" : "destructive"}>
                        {teacher.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => demoteToUser(teacher.id)}
                        disabled={promoting === teacher.id}
                      >
                        {promoting === teacher.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Cabut Peran"
                        )}
                      </Button>
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
