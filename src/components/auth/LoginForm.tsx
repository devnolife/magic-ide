"use client";

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff, User, Lock, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username wajib diisi';
    }
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await login(formData.username, formData.password);
      toast.success('Berhasil masuk! 🎉');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal masuk';
      toast.error(errorMessage);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl border-emerald-100 shadow-xl shadow-emerald-100/50 rounded-3xl overflow-hidden">
      <CardContent className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl mb-4 shadow-lg shadow-emerald-200"
            whileHover={{ rotate: 5, scale: 1.05 }}
          >
            <LogIn className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-extrabold text-gray-800">
            Selamat Datang! 👋
          </h2>
          <p className="text-gray-500 mt-1">
            Masuk ke akun GuruPintar kamu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-600 mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-emerald-400 h-5 w-5" />
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? 'login-username-error' : undefined}
                className={`pl-11 h-12 rounded-xl border-2 bg-emerald-50/50 focus:bg-white transition-colors ${errors.username ? 'border-red-300 bg-red-50/50' : 'border-emerald-100 focus:border-emerald-400'}`}
                placeholder="Masukkan username"
                disabled={isLoading}
              />
            </div>
            {errors.username && (
              <p id="login-username-error" role="alert" className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                <span>⚠️</span> {errors.username}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-600 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-emerald-400 h-5 w-5" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'login-password-error' : undefined}
                className={`pl-11 pr-11 h-12 rounded-xl border-2 bg-emerald-50/50 focus:bg-white transition-colors ${errors.password ? 'border-red-300 bg-red-50/50' : 'border-emerald-100 focus:border-emerald-400'}`}
                placeholder="Masukkan password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                disabled={isLoading}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p id="login-password-error" role="alert" className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
                <span>⚠️</span> {errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-xl transition-all text-base"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Memproses...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Masuk <ArrowIcon />
              </span>
            )}
          </Button>

          {/* Switch to Register */}
          {onSwitchToRegister && (
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">
                Belum punya akun?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                  disabled={isLoading}
                >
                  Daftar Sekarang 🚀
                </button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}