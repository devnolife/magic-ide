"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useRouter } from 'next/navigation';
import { GuruPintarLogo } from '@/components/branding/GuruPintarLogo';
import { PythonMascot } from '@/components/branding/PythonMascot';
import { FloatingShapes } from '@/components/branding/FloatingShapes';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      const redirectUrl = user.role === 'ADMIN' ? '/admin' : user.role === 'TEACHER' ? '/teacher' : '/dashboard';
      router.push(redirectUrl);
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative mx-auto w-20 h-20 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-200" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" />
          </div>
          <p className="text-emerald-600 font-medium">Memuat...</p>
        </motion.div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 relative overflow-hidden">
      <FloatingShapes />

      <div className="relative z-10 min-h-screen flex">
        {/* Left Panel — Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-r-[3rem]" />
          
          <motion.div
            className="relative z-10 text-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <GuruPintarLogo size="xl" showSubtitle className="justify-center mb-8" />
            
            <PythonMascot className="w-64 h-64 mx-auto mb-8" />

            <h2 className="text-2xl font-bold text-gray-700 mb-3">
              Modul Python 🐍
            </h2>
            <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
              Belajar coding Python dari nol dengan visualisasi interaktif, 
              kuis seru, dan tantangan coding yang menyenangkan!
            </p>

            <div className="flex justify-center gap-6 mt-8">
              {[
                { emoji: '📚', label: '6 Chapter' },
                { emoji: '🎯', label: '24 Pelajaran' },
                { emoji: '🏆', label: 'Kuis & Ujian' },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <div className="text-2xl mb-1">{item.emoji}</div>
                  <div className="text-xs font-semibold text-gray-600">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Panel — Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Mobile logo */}
            <div className="lg:hidden mb-8 text-center">
              <GuruPintarLogo size="lg" showSubtitle className="justify-center" />
            </div>

            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}