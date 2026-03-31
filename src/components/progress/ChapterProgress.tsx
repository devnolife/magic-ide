"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Trophy, Clock } from 'lucide-react';

interface ChapterProgressProps {
  chapterNumber: number;
  chapterTitle: string;
  completedLessons: number;
  totalLessons: number;
  totalPoints: number;
  timeSpent: number;
  status: 'not-started' | 'in-progress' | 'completed';
  progressPercent: number;
}

export function ChapterProgress({
  chapterNumber,
  chapterTitle,
  completedLessons,
  totalLessons,
  totalPoints,
  timeSpent,
  status,
  progressPercent,
}: ChapterProgressProps) {
  const statusLabel = {
    'not-started': 'Belum Mulai',
    'in-progress': 'Sedang Berjalan',
    'completed': 'Selesai',
  };

  const statusVariant = {
    'not-started': 'secondary' as const,
    'in-progress': 'default' as const,
    'completed': 'default' as const,
  };

  return (
    <Card className={status === 'completed' ? 'border-green-200 bg-green-50/50' : ''}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Chapter {chapterNumber}: {chapterTitle}
          </CardTitle>
          <Badge variant={statusVariant[status]} className={status === 'completed' ? 'bg-green-100 text-green-700' : ''}>
            {statusLabel[status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={Math.min(progressPercent, 100)} className="h-2" />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{completedLessons}/{totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-yellow-500" />
              <span>{totalPoints} pts</span>
            </div>
            {timeSpent > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{timeSpent} min</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
