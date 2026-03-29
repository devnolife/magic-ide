"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  Medal,
  Crown,
  Star,
  BookOpen,
  Swords,
  Clock,
  Users,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  id: string;
  username: string;
  name: string | null;
  totalPoints: number;
  completedLessons: number;
  completedChallenges: number;
  timeSpent: number;
  rank: number;
}

interface ClassroomOption {
  id: string;
  name: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<LeaderboardEntry | null>(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [classrooms, setClassrooms] = useState<ClassroomOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");
  const [classroomId, setClassroomId] = useState("all");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams({ period });
        if (classroomId !== "all") params.set("classroomId", classroomId);

        const res = await fetch(`/api/leaderboard?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data.leaderboard);
          setMyRank(data.myRank);
          setTotalParticipants(data.totalParticipants);
          setClassrooms(data.classrooms);
        }
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [period, classroomId]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">
            {rank}
          </span>
        );
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200";
      default:
        return "border-border";
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}j ${mins}m` : `${hours}j`;
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="floating" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="w-7 h-7 text-yellow-500" />
                Leaderboard
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Ranking siswa berdasarkan poin pembelajaran
              </p>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Waktu</SelectItem>
                  <SelectItem value="monthly">Bulan Ini</SelectItem>
                  <SelectItem value="weekly">Minggu Ini</SelectItem>
                </SelectContent>
              </Select>

              {classrooms.length > 0 && (
                <Select value={classroomId} onValueChange={setClassroomId}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelas</SelectItem>
                    {classrooms.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* My Rank Card */}
              {myRank && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                          <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Peringkat Kamu
                          </p>
                          <p className="text-2xl font-bold">
                            #{myRank.rank}{" "}
                            <span className="text-base font-normal text-muted-foreground">
                              dari {totalParticipants} siswa
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-bold text-lg">
                            {myRank.totalPoints}
                          </p>
                          <p className="text-muted-foreground">Poin</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-lg">
                            {myRank.completedLessons}
                          </p>
                          <p className="text-muted-foreground">Pelajaran</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold text-lg">
                            {myRank.completedChallenges}
                          </p>
                          <p className="text-muted-foreground">Tantangan</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top 3 Podium */}
              {leaderboard.length >= 3 && (
                <div className="grid grid-cols-3 gap-4">
                  {[leaderboard[1], leaderboard[0], leaderboard[2]].map(
                    (user, idx) => {
                      const podiumOrder = [2, 1, 3];
                      const rank = podiumOrder[idx];
                      const heights = ["h-28", "h-36", "h-24"];
                      const colors = [
                        "from-gray-300 to-gray-400",
                        "from-yellow-300 to-yellow-500",
                        "from-amber-400 to-amber-600",
                      ];
                      const icons = [
                        <Medal key="s" className="w-8 h-8 text-white" />,
                        <Crown key="g" className="w-10 h-10 text-white" />,
                        <Medal key="b" className="w-7 h-7 text-white" />,
                      ];

                      return (
                        <motion.div
                          key={user.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.15 }}
                          className="flex flex-col items-center"
                        >
                          <div className="text-center mb-3">
                            <p className="font-semibold text-sm truncate max-w-[120px]">
                              {user.name || user.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.totalPoints} poin
                            </p>
                          </div>
                          <div
                            className={`w-full ${heights[idx]} bg-gradient-to-t ${colors[idx]} rounded-t-xl flex flex-col items-center justify-center`}
                          >
                            {icons[idx]}
                            <span className="text-white font-bold text-lg mt-1">
                              #{rank}
                            </span>
                          </div>
                        </motion.div>
                      );
                    }
                  )}
                </div>
              )}

              {/* Full Ranking Table */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Ranking Lengkap
                    <Badge variant="secondary" className="ml-2">
                      {totalParticipants} siswa
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {leaderboard.map((user, idx) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.03 }}
                        className={`flex items-center gap-4 p-3 rounded-lg border ${getRankBg(
                          user.rank
                        )} ${
                          myRank?.id === user.id
                            ? "ring-2 ring-primary/30"
                            : ""
                        }`}
                      >
                        {/* Rank */}
                        <div className="w-8 flex justify-center">
                          {getRankIcon(user.rank)}
                        </div>

                        {/* Avatar/Name */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {user.name || user.username}
                            {myRank?.id === user.id && (
                              <Badge
                                variant="outline"
                                className="ml-2 text-xs"
                              >
                                Kamu
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            @{user.username}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1" title="Pelajaran selesai">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{user.completedLessons}</span>
                          </div>
                          <div className="flex items-center gap-1" title="Tantangan selesai">
                            <Swords className="w-3.5 h-3.5" />
                            <span>{user.completedChallenges}</span>
                          </div>
                          <div className="flex items-center gap-1" title="Waktu belajar">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatTime(user.timeSpent)}</span>
                          </div>
                        </div>

                        {/* Points */}
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold text-sm">
                            {user.totalPoints}
                          </span>
                        </div>
                      </motion.div>
                    ))}

                    {leaderboard.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p>Belum ada data leaderboard</p>
                        <p className="text-sm mt-1">
                          Mulai belajar untuk muncul di ranking!
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
