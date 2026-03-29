"use client";

import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

interface GuruPintarLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 24, title: 'text-lg', subtitle: 'text-xs' },
  md: { icon: 32, title: 'text-2xl', subtitle: 'text-sm' },
  lg: { icon: 48, title: 'text-4xl', subtitle: 'text-base' },
  xl: { icon: 64, title: 'text-5xl', subtitle: 'text-lg' },
};

export function GuruPintarLogo({ size = 'md', showSubtitle = false, className = '' }: GuruPintarLogoProps) {
  const s = sizeMap[size];

  return (
    <motion.div
      className={`flex items-center gap-3 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div className="bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl p-2 shadow-lg shadow-emerald-200">
          <GraduationCap size={s.icon} className="text-white" />
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-sm" />
      </div>
      <div>
        <h1 className={`${s.title} font-extrabold tracking-tight`}>
          <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
            Guru
          </span>
          <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
            Pintar
          </span>
        </h1>
        {showSubtitle && (
          <p className={`${s.subtitle} text-gray-500 font-medium -mt-1`}>
            Platform Belajar Pintar 🎓
          </p>
        )}
      </div>
    </motion.div>
  );
}
