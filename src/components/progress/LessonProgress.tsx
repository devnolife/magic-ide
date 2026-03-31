"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Circle } from 'lucide-react';

interface LessonProgressItem {
  id: string;
  status: string;
  timeSpent: number;
  completedAt: string | null;
  lesson: {
    id: string;
    number: number;
    title: string;
  };
}

interface LessonProgressProps {
  lessons: LessonProgressItem[];
  totalLessons: number;
}

export function LessonProgress({ lessons, totalLessons }: LessonProgressProps) {
  const completedCount = lessons.filter(l => l.status === 'COMPLETED').length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
        <span>Lessons</span>
        <span>{completedCount}/{totalLessons} selesai</span>
      </div>
      {lessons.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada progress</p>
      ) : (
        <div className="space-y-1.5">
          {lessons.map((lp) => (
            <div key={lp.id} className="flex items-center gap-2 text-sm">
              {lp.status === 'COMPLETED' ? (
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              ) : lp.status === 'IN_PROGRESS' ? (
                <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-gray-300 shrink-0" />
              )}
              <span className={lp.status === 'COMPLETED' ? 'text-foreground' : 'text-muted-foreground'}>
                {lp.lesson.title}
              </span>
              {lp.timeSpent > 0 && (
                <Badge variant="outline" className="ml-auto text-xs">
                  {lp.timeSpent} min
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
