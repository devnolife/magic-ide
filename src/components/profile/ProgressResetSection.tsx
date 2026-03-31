"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface ChapterProgress {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  completedLessons: number;
  totalLessons: number;
  totalPoints: number;
  status: string;
  progressPercent: number;
}

export default function ProgressResetSection() {
  const [chapters, setChapters] = useState<ChapterProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [resettingId, setResettingId] = useState<string | null>(null);

  async function fetchProgress() {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) return;

      const res = await fetch("/api/progress", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();
      // Only show chapters that have been started
      const started = (data.progress as ChapterProgress[]).filter(
        (ch) => ch.status !== "not-started"
      );
      setChapters(started);
    } catch {
      toast.error("Gagal memuat data progress.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProgress();
  }, []);

  async function handleReset(chapterId: string, chapterNumber: number) {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin mereset progress Chapter ${chapterNumber}? Semua data lesson yang telah diselesaikan akan dihapus. Tindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmed) return;

    setResettingId(chapterId);

    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        toast.error("Sesi tidak ditemukan. Silakan login kembali.");
        return;
      }

      const res = await fetch("/api/progress", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ chapterId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal mereset progress.");
        return;
      }

      toast.success(data.message || "Progress berhasil direset!");
      await fetchProgress();
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setResettingId(null);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-lg bg-muted p-2">
            <RotateCcw className="size-5 text-foreground" />
          </div>
          Reset Progress
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Reset progress belajar untuk chapter tertentu. Data lesson dan poin
          yang telah dicapai akan dihapus.
        </p>
      </CardHeader>
      <CardContent>
        {chapters.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Belum ada progress yang bisa direset.
          </p>
        ) : (
          <div className="space-y-3">
            {chapters.map((ch) => (
              <div
                key={ch.chapterId}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-muted p-2">
                    <BookOpen className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      Chapter {ch.chapterNumber}: {ch.chapterTitle}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="text-xs"
                      >
                        {ch.completedLessons}/{ch.totalLessons} lesson
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {ch.totalPoints} poin
                      </Badge>
                      <Badge
                        variant={
                          ch.status === "completed" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {ch.status === "completed"
                          ? "Selesai"
                          : "Sedang Berlangsung"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={resettingId === ch.chapterId}
                  onClick={() => handleReset(ch.chapterId, ch.chapterNumber)}
                >
                  {resettingId === ch.chapterId ? (
                    <Loader2 className="mr-1 size-3 animate-spin" />
                  ) : (
                    <RotateCcw className="mr-1 size-3" />
                  )}
                  Reset
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
