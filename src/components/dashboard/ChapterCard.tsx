"use client";

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ChapterCardProps {
  chapter: {
    id: number;
    title: string;
    description: string;
    icon: string;
    progress: number;
    status: 'not-started' | 'in-progress' | 'completed';
    estimatedTime: string;
    href: string;
    totalLessons: number;
    completedLessons: number;
  };
  index: number;
  isLocked: boolean;
}

export function ChapterCard({ chapter, index, isLocked }: ChapterCardProps) {
  const getStatusBadge = (status: string) => {
    if (isLocked) {
      return <Badge variant="outline" className="text-muted-foreground"><Lock className="w-3 h-3 mr-1" />Terkunci</Badge>;
    }
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" />Selesai</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Sedang Berjalan</Badge>;
      default:
        return <Badge variant="outline">Belum Dimulai</Badge>;
    }
  };

  const buttonLabel = isLocked
    ? 'Selesaikan chapter sebelumnya'
    : chapter.status === 'completed'
      ? 'Tinjau Ulang'
      : chapter.status === 'in-progress'
        ? 'Lanjutkan'
        : 'Mulai';

  const cardContent = (
    <Card className={`
      h-full transition-all duration-300
      ${isLocked
        ? 'opacity-60 grayscale cursor-not-allowed'
        : 'hover:shadow-lg hover:scale-[1.02] cursor-pointer'
      }
    `}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`text-3xl ${isLocked ? 'opacity-50' : ''}`}>
              {isLocked ? '🔒' : chapter.icon}
            </div>
            <div>
              <h3 className="font-bold text-lg">{chapter.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{chapter.description}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">
                {isLocked ? 'Terkunci' : `${chapter.completedLessons}/${chapter.totalLessons} Lesson`}
              </span>
              <span className="text-sm font-medium">{chapter.progress}%</span>
            </div>
            <Progress value={isLocked ? 0 : chapter.progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            {getStatusBadge(chapter.status)}
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              {chapter.estimatedTime}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        {isLocked ? (
          <Button className="w-full" variant="outline" disabled>
            <Lock className="w-4 h-4 mr-2" />
            {buttonLabel}
          </Button>
        ) : (
          <Link href={chapter.href} className="w-full">
            <Button className="w-full">
              {buttonLabel}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {cardContent}
    </motion.div>
  );
}
