"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Loader2,
  RefreshCw,
  TrendingUp,
  Clock,
  Target,
  Users,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Types ---

interface FunnelItem {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  started: number;
  completed: number;
}

interface ChallengeStat {
  challengeId: string;
  title: string;
  difficulty: string;
  points: number;
  avgScore: number;
  attempts: number;
}

interface TimeItem {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  avgMinutes: number;
  totalStudents: number;
}

interface ActivityDay {
  date: string;
  count: number;
}

interface ProgressDistribution {
  ranges: Array<{ label: string; count: number }>;
  totalStudents: number;
}

interface AnalyticsData {
  completionFunnel: FunnelItem[];
  challengeDifficulty: ChallengeStat[];
  timeDistribution: TimeItem[];
  activityTrends: ActivityDay[];
  progressDistribution: ProgressDistribution;
}

// --- Helpers ---

function scoreColor(score: number) {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

function scoreTextColor(score: number) {
  if (score >= 80) return 'text-emerald-700';
  if (score >= 50) return 'text-amber-700';
  return 'text-red-700';
}

function scoreBadgeColor(score: number) {
  if (score >= 80) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  if (score >= 50) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-red-100 text-red-700 border-red-200';
}

const DIST_COLORS = [
  { bg: 'bg-red-500', text: 'text-red-700', badge: 'bg-red-100 text-red-700' },
  { bg: 'bg-amber-500', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700' },
  { bg: 'bg-blue-500', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
  { bg: 'bg-emerald-500', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
];

const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: 'Mudah',
  MEDIUM: 'Sedang',
  HARD: 'Sulit',
};

// --- Component ---

export default function AnalyticsSection() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Gagal memuat data analitik');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchAnalytics();
    }
  }, [user, fetchAnalytics]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-3 text-muted-foreground">Memuat analitik...</span>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-red-600">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchAnalytics}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Coba Lagi
        </Button>
      </div>
    );
  }

  if (!data) return null;

  const maxActivity = Math.max(...data.activityTrends.map((d) => d.count), 1);
  const maxTime = Math.max(...data.timeDistribution.map((d) => d.avgMinutes), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          📊 Analitik Platform
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAnalytics}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Funnel Penyelesaian Chapter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Funnel Penyelesaian Chapter
            </CardTitle>
            <CardDescription>Jumlah siswa yang memulai vs menyelesaikan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.completionFunnel.map((item) => {
                const startedPct = 100;
                const completedPct =
                  item.started > 0
                    ? Math.round((item.completed / item.started) * 100)
                    : 0;

                return (
                  <div key={item.chapterId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate max-w-[60%]">
                        Ch {item.chapterNumber}: {item.chapterTitle}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {item.completed}/{item.started} selesai
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-14">Mulai</span>
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${startedPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{item.started}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground w-14">Selesai</span>
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${completedPct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{item.completed}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {data.completionFunnel.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Belum ada data chapter.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Distribusi Progress Siswa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-purple-600" />
              Distribusi Progress Siswa
            </CardTitle>
            <CardDescription>
              Sebaran tingkat penyelesaian dari {data.progressDistribution.totalStudents} siswa
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.progressDistribution.totalStudents === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-4">
                Belum ada data progress.
              </p>
            ) : (
              <div className="space-y-5">
                {/* Stacked bar */}
                <div className="h-8 rounded-full overflow-hidden flex bg-muted">
                  {data.progressDistribution.ranges.map((range, i) => {
                    const pct =
                      data.progressDistribution.totalStudents > 0
                        ? (range.count / data.progressDistribution.totalStudents) * 100
                        : 0;
                    if (pct === 0) return null;
                    return (
                      <div
                        key={range.label}
                        className={`${DIST_COLORS[i].bg} transition-all duration-500 flex items-center justify-center`}
                        style={{ width: `${pct}%` }}
                        title={`${range.label}: ${range.count} siswa (${Math.round(pct)}%)`}
                      >
                        {pct > 8 && (
                          <span className="text-white text-xs font-medium">
                            {Math.round(pct)}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-3">
                  {data.progressDistribution.ranges.map((range, i) => {
                    const pct =
                      data.progressDistribution.totalStudents > 0
                        ? Math.round(
                            (range.count / data.progressDistribution.totalStudents) * 100
                          )
                        : 0;
                    return (
                      <div
                        key={range.label}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <div className={`w-3 h-3 rounded-full ${DIST_COLORS[i].bg} shrink-0`} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{range.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {range.count} siswa ({pct}%)
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Tingkat Kesulitan Tantangan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-orange-600" />
              Tingkat Kesulitan Tantangan
            </CardTitle>
            <CardDescription>Rata-rata skor dan jumlah percobaan per tantangan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {data.challengeDifficulty.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Belum ada data tantangan.
                </p>
              ) : (
                data.challengeDifficulty.map((ch) => (
                  <div key={ch.challengeId} className="space-y-1.5 pb-3 border-b last:border-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium truncate max-w-[55%]">
                        {ch.title}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="outline" className="text-xs">
                          {DIFFICULTY_LABELS[ch.difficulty] || ch.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {ch.attempts} percobaan
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${scoreColor(ch.avgScore)}`}
                          style={{ width: `${ch.avgScore}%` }}
                        />
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${scoreBadgeColor(ch.avgScore)}`}
                      >
                        {ch.avgScore}%
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Waktu Belajar per Chapter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-cyan-600" />
              Waktu Belajar per Chapter
            </CardTitle>
            <CardDescription>Rata-rata waktu belajar (menit) per chapter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.timeDistribution.map((item) => {
                const pct = maxTime > 0 ? (item.avgMinutes / maxTime) * 100 : 0;
                return (
                  <div key={item.chapterId} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate max-w-[60%]">
                        Ch {item.chapterNumber}: {item.chapterTitle}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {item.totalStudents} siswa
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium w-16 text-right">
                        {item.avgMinutes} menit
                      </span>
                    </div>
                  </div>
                );
              })}
              {data.timeDistribution.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Belum ada data waktu belajar.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card 5: Aktivitas Harian (full width) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
            Aktivitas Harian (30 Hari Terakhir)
          </CardTitle>
          <CardDescription>Jumlah pengguna aktif per hari</CardDescription>
        </CardHeader>
        <CardContent>
          {data.activityTrends.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-4">
              Belum ada data aktivitas.
            </p>
          ) : (
            <div className="space-y-3">
              {/* Sparkline bar chart */}
              <div className="flex items-end gap-[3px] h-32">
                {data.activityTrends.map((day) => {
                  const heightPct = maxActivity > 0 ? (day.count / maxActivity) * 100 : 0;
                  return (
                    <div
                      key={day.date}
                      className="flex-1 flex flex-col items-center justify-end group relative"
                    >
                      <div
                        className="w-full bg-indigo-500 rounded-t transition-all duration-300 hover:bg-indigo-600 min-h-[2px]"
                        style={{ height: `${Math.max(heightPct, 2)}%` }}
                        title={`${day.date}: ${day.count} pengguna aktif`}
                      />
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {day.count} aktif
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Date labels - show a subset */}
              <div className="flex justify-between text-xs text-muted-foreground">
                {data.activityTrends.length > 0 && (
                  <>
                    <span>
                      {new Date(data.activityTrends[0].date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    {data.activityTrends.length > 14 && (
                      <span>
                        {new Date(
                          data.activityTrends[Math.floor(data.activityTrends.length / 2)].date
                        ).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                    <span>
                      {new Date(
                        data.activityTrends[data.activityTrends.length - 1].date
                      ).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </>
                )}
              </div>

              {/* Summary row */}
              <div className="flex items-center justify-between pt-2 border-t text-sm">
                <span className="text-muted-foreground">Total hari aktif</span>
                <span className="font-medium">
                  {data.activityTrends.filter((d) => d.count > 0).length} / {data.activityTrends.length} hari
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
