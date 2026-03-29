"use client";

import { motion } from 'framer-motion';
import { LottieAnimation } from '@/components/animations/LottieAnimation';

export function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50">
      <div className="text-center">
        <div className="mx-auto mb-4">
          <LottieAnimation src="/asset/loading-python.json" width={128} height={128} />
        </div>
        <motion.p
          className="text-lg font-medium text-gray-600"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Memuat Python Learning Hub...
        </motion.p>
      </div>
    </div>
  );
}
