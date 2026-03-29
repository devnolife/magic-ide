"use client";

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff, User, Mail, Lock, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username wajib diisi';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password minimal 6 karakter';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password, formData.name || undefined);
      toast.success('Akun berhasil dibuat! Selamat belajar! 🎉');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal membuat akun';
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

  const inputClass = (field: string) =>
    `pl-11 h-12 rounded-xl border-2 bg-emerald-50/50 focus:bg-white transition-colors ${
      errors[field] ? 'border-red-300 bg-red-50/50' : 'border-emerald-100 focus:border-emerald-400'
    }`;

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl border-emerald-100 shadow-xl shadow-emerald-100/50 rounded-3xl overflow-hidden">
      <CardContent className="p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-emerald-500 rounded-2xl mb-4 shadow-lg shadow-blue-200"
            whileHover={{ rotate: -5, scale: 1.05 }}
          >
            <UserPlus className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-extrabold text-gray-800">
            Buat Akun Baru 🚀
          </h2>
          <p className="text-gray-500 mt-1">
            Bergabung dengan GuruPintar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-600 mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
              <Input
                id="name" name="name" type="text"
                value={formData.name} onChange={handleChange}
                className="pl-11 h-12 rounded-xl border-2 border-emerald-100 bg-emerald-50/50 focus:bg-white focus:border-emerald-400 transition-colors"
                placeholder="Nama kamu (opsional)"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-600 mb-1.5">
              Username <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-emerald-400 h-5 w-5" />
              <Input
                id="username" name="username" type="text"
                value={formData.username} onChange={handleChange}
                className={inputClass('username')}
                placeholder="Pilih username"
                disabled={isLoading}
              />
            </div>
            {errors.username && <p className="mt-1 text-sm text-red-500">⚠️ {errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-600 mb-1.5">
              Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-emerald-400 h-5 w-5" />
              <Input
                id="email" name="email" type="email"
                value={formData.email} onChange={handleChange}
                className={inputClass('email')}
                placeholder="email@contoh.com"
                disabled={isLoading}
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-500">⚠️ {errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-600 mb-1.5">
              Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-emerald-400 h-5 w-5" />
              <Input
                id="password" name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password} onChange={handleChange}
                className={`pr-11 ${inputClass('password')}`}
                placeholder="Minimal 6 karakter"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">⚠️ {errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-600 mb-1.5">
              Konfirmasi Password <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-emerald-400 h-5 w-5" />
              <Input
                id="confirmPassword" name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword} onChange={handleChange}
                className={`pr-11 ${inputClass('confirmPassword')}`}
                placeholder="Ulangi password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                disabled={isLoading}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">⚠️ {errors.confirmPassword}</p>}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all text-base mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Membuat akun...
              </span>
            ) : (
              'Buat Akun ✨'
            )}
          </Button>

          {/* Switch to Login */}
          {onSwitchToLogin && (
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">
                Sudah punya akun?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline"
                  disabled={isLoading}
                >
                  Masuk di sini 🔑
                </button>
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}