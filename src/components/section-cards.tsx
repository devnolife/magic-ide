"use client"

import { TrendingUp, Flame, BookOpen, Target } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ChapterProgress } from "@/components/dashboard/ChapterGrid"

interface SectionCardsProps {
  progressData?: ChapterProgress[];
}

export function SectionCards({ progressData }: SectionCardsProps) {
  const totalChapters = progressData?.length ?? 0;
  const completedCount = progressData?.filter((c) => c.status === 'completed').length ?? 0;
  const inProgressCount = progressData?.filter((c) => c.status === 'in-progress').length ?? 0;
  const overallPercent =
    totalChapters > 0
      ? Math.round(
          progressData!.reduce((sum, ch) => sum + ch.progressPercent, 0) / totalChapters
        )
      : 0;
  const totalPoints = progressData?.reduce((sum, ch) => sum + ch.totalPoints, 0) ?? 0;
  const totalTimeMinutes = progressData?.reduce((sum, ch) => sum + ch.timeSpent, 0) ?? 0;

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} jam ${mins} menit` : `${hours} jam`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Progress Keseluruhan</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {overallPercent}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp className="size-3" />
              {completedCount}/{totalChapters}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {completedCount} chapter selesai <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {inProgressCount} sedang berjalan
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Waktu Belajar</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatTime(totalTimeMinutes)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Flame className="size-3" />
              Aktif
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Tetap konsisten! <Flame className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Total akumulasi waktu belajar
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Poin</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalPoints.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <Target className="size-3" />
              Pelajar
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Terus kumpulkan poin!
          </div>
          <div className="text-muted-foreground">
            Dari {completedCount} chapter yang selesai
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Materi Tersedia</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalChapters} Chapter
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <BookOpen className="size-3" />
              Lengkap
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Dari dasar hingga project <BookOpen className="size-4" />
          </div>
          <div className="text-muted-foreground">
            {totalChapters - completedCount - inProgressCount} belum dimulai
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
