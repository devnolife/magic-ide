"use client";

import Link from "next/link";
import { chaptersData } from "@/data/dashboardData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { BookOpen, Clock, ChevronRight } from "lucide-react";

const lessonCounts: Record<number, number> = {
  0: 4,
  1: 5,
  2: 4,
  3: 4,
  4: 4,
  5: 4,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TeacherMaterialsPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3 mb-1">
          <BookOpen className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Materi Pembelajaran
          </h1>
        </div>
        <p className="text-muted-foreground">
          Kelola dan lihat semua materi pembelajaran Python untuk setiap chapter.
        </p>
      </motion.div>

      {/* Chapter Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      >
        {chaptersData.map((chapter) => (
          <motion.div key={chapter.id} variants={itemVariants}>
            <Card className="border shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-2xl shadow-sm">
                    {chapter.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      Chapter {chapter.id}
                    </p>
                    <CardTitle className="text-base leading-tight truncate">
                      {chapter.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {chapter.description}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {lessonCounts[chapter.id] ?? 0} Materi
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {chapter.estimatedTime}
                  </Badge>
                </div>
                <div className="mt-auto pt-2">
                  <Link href={`/teacher/materials/${chapter.id}`}>
                    <Button
                      variant="outline"
                      className="w-full group border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
                    >
                      Lihat Materi
                      <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
