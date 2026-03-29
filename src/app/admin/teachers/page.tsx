"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Guru</h1>
          <p className="text-gray-600 mt-1">Kelola akun guru dan kelas mereka</p>
        </div>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => setShowPromote(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" /> Tambah Guru
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Guru</p>
                <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Kelas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teachers.reduce((acc, t) => acc + (t._count?.classrooms || 0), 0)}
                </p>
              </div>
              <School className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
                <p className="text-2xl font-bold text-gray-900">{allUsers.length}</p>
              </div>
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promote Modal */}
      {showPromote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowPromote(false)} />
          <Card className="relative z-10 w-full max-w-lg max-h-[80vh] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-emerald-600" />
                Promosi Pengguna Menjadi Guru
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-9"
                  placeholder="Cari pengguna..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px]">
                {eligibleUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-6">
                    {search ? "Tidak ditemukan pengguna yang cocok" : "Tidak ada pengguna yang dapat dipromosikan"}
                  </p>
                ) : (
                  eligibleUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{u.name || u.username}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
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
            </CardContent>
          </Card>
        </div>
      )}

      {/* Teachers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-green-600" />
            Daftar Guru ({teachers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="mb-3">Belum ada guru terdaftar.</p>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setShowPromote(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" /> Tambah Guru Pertama
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-600">
                    <th className="py-3 px-2 font-medium">Nama</th>
                    <th className="py-3 px-2 font-medium">Username</th>
                    <th className="py-3 px-2 font-medium">Email</th>
                    <th className="py-3 px-2 font-medium text-center">Kelas</th>
                    <th className="py-3 px-2 font-medium text-center">Status</th>
                    <th className="py-3 px-2 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium text-gray-900">
                        {teacher.name || "—"}
                      </td>
                      <td className="py-3 px-2 text-gray-600">{teacher.username}</td>
                      <td className="py-3 px-2 text-gray-600">{teacher.email}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant="secondary">
                          <School className="h-3 w-3 mr-1" />
                          {teacher._count?.classrooms ?? 0}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant={teacher.isActive ? "default" : "destructive"}>
                          {teacher.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-orange-600 border-orange-300 hover:bg-orange-50"
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
        </CardContent>
      </Card>
    </div>
  );
}
