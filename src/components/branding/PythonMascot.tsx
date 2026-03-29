"use client";

import { motion } from 'framer-motion';

export function PythonMascot({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Snake body */}
        <motion.path
          d="M60 140 C60 140, 40 120, 50 100 C60 80, 80 85, 90 75 C100 65, 95 50, 105 45 C115 40, 130 50, 135 60 C140 70, 130 80, 140 90 C150 100, 160 95, 155 110 C150 125, 130 120, 125 130 C120 140, 130 150, 120 155"
          fill="none"
          stroke="url(#snakeGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Snake head */}
        <motion.g
          animate={{ rotate: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: '105px 42px' }}
        >
          <circle cx="105" cy="38" r="18" fill="#10B981" />
          <circle cx="105" cy="38" r="16" fill="#34D399" />
          {/* Eyes */}
          <circle cx="98" cy="33" r="5" fill="white" />
          <circle cx="112" cy="33" r="5" fill="white" />
          <motion.circle
            cx="99" cy="33" r="3" fill="#1a2e1a"
            animate={{ cx: [99, 100, 99] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.circle
            cx="113" cy="33" r="3" fill="#1a2e1a"
            animate={{ cx: [113, 114, 113] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          {/* Smile */}
          <path d="M98 43 Q105 50 112 43" fill="none" stroke="#065F46" strokeWidth="2" strokeLinecap="round" />
          {/* Tongue */}
          <motion.g
            animate={{ scaleY: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            style={{ transformOrigin: '105px 50px' }}
          >
            <path d="M105 50 L105 58 L101 62 M105 58 L109 62" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
          </motion.g>
        </motion.g>

        {/* Python text/hat */}
        <text x="75" y="175" className="fill-emerald-700 text-xs font-bold" fontSize="14" fontFamily="monospace">
          {'{ Python }'}
        </text>

        <defs>
          <linearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
