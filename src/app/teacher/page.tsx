"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  School,
  Users,
  TrendingUp,
  Plus,
  Upload,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface ClassroomSummary {
  id: string;
  name: string;
  description: string | null;
  _count: { students: number };
  createdAt: string;
}

interface DashboardData {
  totalClassrooms: number;
  totalStudents: number;
  averageProgress: number;
  recentClassrooms: ClassroomSummary[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const res = await fetch("/api/classrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const classrooms: ClassroomSummary[] = await res.json();

        const totalStudents = classrooms.reduce(
          (sum, c) => sum + (c._count?.students ?? 0),
          0
        );

        // Fetch progress for each classroom to compute average
        let totalProgress = 0;
        let progressCount = 0;
        await Promise.all(
          classrooms.map(async (c) => {
            try {
              const pRes = await fetch(`/api/classrooms/${c.id}/progress`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (pRes.ok) {
                const progressData = await pRes.json();
                if (Array.isArray(progressData) && progressData.length > 0) {
                  progressData.forEach(
                    (s: { completionPercentage?: number }) => {
                      totalProgress += s.completionPercentage ?? 0;
                      progressCount++;
                    }
                  );
                }
              }
            } catch {
              // skip
            }
          })
        );

        setData({
          totalClassrooms: classrooms.length,
          totalStudents,
          averageProgress:
            progressCount > 0 ? Math.round(totalProgress / progressCount) : 0,
          recentClassrooms: classrooms.slice(0, 5),
        });
      }
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
          <p className="mt-4 text-gray-500">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Kelas",
      value: data?.totalClassrooms ?? 0,
      icon: School,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Total Murid",
      value: data?.totalStudents ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Rata-rata Progress",
      value: `${data?.averageProgress ?? 0}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Greeting */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-1">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Selamat Datang, {user?.name || user?.username}!
          </h1>
        </div>
        <p className="text-gray-500">
          Kelola kelas dan pantau perkembangan murid Anda.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="bg-white/70 backdrop-blur-md border-white/20 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-3"
      >
        <Link href="/teacher/classrooms/new">
          <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
            <Plus className="h-4 w-4 mr-2" />
            Buat Kelas Baru
          </Button>
        </Link>
        <Link href="/teacher/classrooms">
          <Button variant="outline" className="w-full sm:w-auto">
            <Upload className="h-4 w-4 mr-2" />
            Upload Murid
          </Button>
        </Link>
      </motion.div>

      {/* Recent Classrooms */}
      <motion.div variants={itemVariants}>
        <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <School className="h-5 w-5 text-purple-600" />
              Kelas Terbaru
            </CardTitle>
            <Link href="/teacher/classrooms">
              <Button variant="ghost" size="sm" className="text-purple-600">
                Lihat Semua
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {data?.recentClassrooms && data.recentClassrooms.length > 0 ? (
              <div className="space-y-3">
                {data.recentClassrooms.map((classroom) => (
                  <Link
                    key={classroom.id}
                    href={`/teacher/classrooms/${classroom.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50/80 hover:bg-purple-50/80 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow">
                          {classroom.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                            {classroom.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {classroom.description || "Tidak ada deskripsi"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {classroom._count?.students ?? 0} murid
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <School className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">Belum ada kelas.</p>
                <Link href="/teacher/classrooms/new">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Kelas Pertama
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
