"use client";

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, ArrowRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Chapter } from '@/data/dashboardData';

interface ChapterCardProps {
  chapter: Chapter;
  index: number;
}

export function ChapterCard({ chapter, index }: ChapterCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Selesai</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Sedang Berjalan</Badge>;
      case 'locked':
        return <Badge className="bg-gray-100 text-gray-600 border-gray-200">Terkunci</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-600 border-gray-200">Belum Dimulai</Badge>;
    }
  };

  const isAccessible = chapter.status !== 'locked';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className={`
        h-full bg-white/70 backdrop-blur-md border-white/20 shadow-xl 
        transition-all duration-300 hover:shadow-2xl hover:scale-105
        ${!isAccessible ? 'opacity-60' : 'cursor-pointer'}
      `}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{chapter.icon}</div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{chapter.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
              </div>
            </div>
            {!isAccessible && <Lock className="w-5 h-5 text-gray-400" />}
          </div>
        </CardHeader>

        <CardContent className="py-4">
          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Progress</span>
                <span className="text-sm font-medium text-gray-900">{chapter.progress}%</span>
              </div>
              <Progress value={chapter.progress} className="h-2" />
            </div>

            {/* Status and Time */}
            <div className="flex items-center justify-between">
              {getStatusBadge(chapter.status)}
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {chapter.estimatedTime}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4">
          {isAccessible ? (
            <Link href={chapter.href} className="w-full">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                {chapter.status === 'completed' ? 'Review' :
                  chapter.status === 'in-progress' ? 'Lanjutkan' : 'Mulai'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button disabled className="w-full">
              <Lock className="w-4 h-4 mr-2" />
              Terkunci
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
