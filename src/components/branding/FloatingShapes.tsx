"use client";

import { motion } from 'framer-motion';

const shapes = [
  { type: 'circle', color: 'bg-emerald-300/30', size: 'w-20 h-20', x: '10%', y: '20%', delay: 0 },
  { type: 'circle', color: 'bg-blue-300/25', size: 'w-32 h-32', x: '75%', y: '10%', delay: 1 },
  { type: 'circle', color: 'bg-yellow-300/30', size: 'w-16 h-16', x: '85%', y: '60%', delay: 2 },
  { type: 'circle', color: 'bg-cyan-300/25', size: 'w-24 h-24', x: '5%', y: '70%', delay: 0.5 },
  { type: 'circle', color: 'bg-emerald-400/20', size: 'w-14 h-14', x: '50%', y: '80%', delay: 1.5 },
  { type: 'circle', color: 'bg-blue-400/20', size: 'w-28 h-28', x: '30%', y: '5%', delay: 2.5 },
  { type: 'circle', color: 'bg-teal-300/25', size: 'w-10 h-10', x: '60%', y: '45%', delay: 3 },
  { type: 'circle', color: 'bg-sky-300/20', size: 'w-18 h-18', x: '90%', y: '85%', delay: 1.8 },
];

const emojis = [
  { emoji: '🐍', x: '15%', y: '15%', delay: 0.3 },
  { emoji: '💻', x: '80%', y: '25%', delay: 1.2 },
  { emoji: '🎯', x: '70%', y: '75%', delay: 2.1 },
  { emoji: '⭐', x: '25%', y: '85%', delay: 0.8 },
  { emoji: '📚', x: '90%', y: '45%', delay: 1.6 },
  { emoji: '🚀', x: '45%', y: '10%', delay: 2.4 },
];

export function FloatingShapes({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes.map((shape, i) => (
        <motion.div
          key={`shape-${i}`}
          className={`absolute rounded-full ${shape.color} ${shape.size} animate-blob`}
          style={{ left: shape.x, top: shape.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: shape.delay, duration: 0.8 }}
        />
      ))}

      {emojis.map((item, i) => (
        <motion.div
          key={`emoji-${i}`}
          className="absolute text-2xl animate-float"
          style={{ left: item.x, top: item.y, animationDelay: `${item.delay}s` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: item.delay + 0.5, duration: 0.6 }}
        >
          {item.emoji}
        </motion.div>
      ))}
    </div>
  );
}
