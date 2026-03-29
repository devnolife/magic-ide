"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  School,
  Users,
  Plus,
  Search,
  Calendar,
  ArrowRight,
} from "lucide-react";

interface Classroom {
  id: string;
  name: string;
  description: string | null;
  _count: { students: number };
  createdAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ClassroomListPage() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const res = await fetch("/api/classrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setClassrooms(data);
      }
    } catch (err) {
      console.error("Failed to fetch classrooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = classrooms.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
          <p className="mt-4 text-gray-500">Memuat daftar kelas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daftar Kelas</h1>
          <p className="text-gray-500 text-sm">
            Kelola semua kelas yang Anda buat
          </p>
        </div>
        <Link href="/teacher/classrooms/new">
          <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Buat Kelas Baru
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Cari kelas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white/70 backdrop-blur border-gray-200"
        />
      </div>

      {/* Classroom grid */}
      {filtered.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {filtered.map((classroom) => (
            <motion.div key={classroom.id} variants={itemVariants}>
              <Link href={`/teacher/classrooms/${classroom.id}`}>
                <Card className="h-full bg-white/70 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {classroom.name.charAt(0).toUpperCase()}
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-purple-600 transition-colors" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-purple-700 transition-colors">
                      {classroom.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {classroom.description || "Tidak ada deskripsi"}
                    </p>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {classroom._count?.students ?? 0} murid
                      </Badge>
                      <Badge variant="outline" className="text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(classroom.createdAt)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <School className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          {search ? (
            <>
              <p className="text-gray-500 text-lg mb-2">
                Tidak ada kelas yang cocok
              </p>
              <p className="text-gray-400 text-sm">
                Coba ubah kata kunci pencarian Anda.
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-lg mb-2">Belum ada kelas</p>
              <p className="text-gray-400 text-sm mb-6">
                Mulai dengan membuat kelas pertama Anda.
              </p>
              <Link href="/teacher/classrooms/new">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Kelas Baru
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
