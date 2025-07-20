"use client";

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface LessonContainerProps {
  children: React.ReactNode;
}

export default function LessonContainer({ children }: LessonContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <div className="p-8">
          {children}
        </div>
      </Card>
    </motion.div>
  );
}
