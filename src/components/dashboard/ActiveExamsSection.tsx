'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardList, Clock, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ActiveExam {
  id: string;
  quizTitle: string;
  quizDescription: string | null;
  classroomName: string;
  duration: number | null;
  startedAt: string | null;
  alreadySubmitted: boolean;
}

export function ActiveExamsSection() {
  const [exams, setExams] = useState<ActiveExam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (!token) return;

        const res = await fetch('/api/exams/active', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setExams(data.sessions ?? []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading || exams.length === 0) return null;

  const pending = exams.filter((e) => !e.alreadySubmitted);
  const submitted = exams.filter((e) => e.alreadySubmitted);

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="size-5 text-orange-500" />
        <h2 className="text-lg font-semibold">
          Ujian Aktif
          {pending.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {pending.length} belum dikerjakan
            </Badge>
          )}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {exams.map((exam) => (
          <Card
            key={exam.id}
            className={`@container/card ${
              exam.alreadySubmitted
                ? 'opacity-70 border-green-500/30'
                : 'border-orange-500/50 bg-gradient-to-t from-orange-500/5 to-card shadow-sm'
            }`}
          >
            <CardHeader>
              <CardDescription className="flex items-center gap-1.5">
                <ClipboardList className="size-3.5" />
                {exam.classroomName}
              </CardDescription>
              <CardTitle className="text-base font-semibold">
                {exam.quizTitle}
              </CardTitle>
              {exam.duration && (
                <Badge variant="outline" className="w-fit">
                  <Clock className="size-3 mr-1" />
                  {exam.duration} menit
                </Badge>
              )}
            </CardHeader>
            <CardFooter className="flex items-center justify-between">
              {exam.alreadySubmitted ? (
                <div className="flex items-center gap-1.5 text-sm text-green-600">
                  <CheckCircle2 className="size-4" />
                  Sudah dikerjakan
                </div>
              ) : (
                <Button asChild size="sm">
                  <Link href={`/exam/${exam.id}`}>
                    Kerjakan
                    <ArrowRight className="size-4 ml-1" />
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {submitted.length > 0 && pending.length > 0 && (
        <p className="text-xs text-muted-foreground mt-2">
          {submitted.length} ujian sudah dikerjakan
        </p>
      )}
    </div>
  );
}
