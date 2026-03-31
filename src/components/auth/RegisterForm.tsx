"use client";

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff, User, Mail, Lock, UserPlus, KeyRound } from 'lucide-react';
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
    activationCode: '',
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
      await register(formData.username, formData.email, formData.password, formData.name || undefined, formData.activationCode || undefined);
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
    `pl-9 h-10 text-sm rounded-xl border-2 bg-emerald-50/50 focus:bg-white transition-colors ${
      errors[field] ? 'border-red-300 bg-red-50/50' : 'border-emerald-100 focus:border-emerald-400'
    }`;

  return (
    <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-xl border-emerald-100 shadow-xl shadow-emerald-100/50 rounded-3xl overflow-hidden">
      <CardContent className="p-6 sm:p-7">
        {/* Header — compact */}
        <div className="text-center mb-4">
          <motion.div
            className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-emerald-500 rounded-xl mb-2 shadow-lg shadow-blue-200"
            whileHover={{ rotate: -5, scale: 1.05 }}
          >
            <UserPlus className="h-6 w-6 text-white" />
          </motion.div>
          <h2 className="text-xl font-extrabold text-gray-800">
            Buat Akun Baru 🚀
          </h2>
          <p className="text-gray-500 text-sm">
            Bergabung dengan GuruPintar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Row 1: Name + Username side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-600 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                <Input
                  id="name" name="name" type="text"
                  value={formData.name} onChange={handleChange}
                  className="pl-9 h-10 text-sm rounded-xl border-2 border-emerald-100 bg-emerald-50/50 focus:bg-white focus:border-emerald-400 transition-colors"
                  placeholder="Opsional"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-gray-600 mb-1">
                Username <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 h-4 w-4" />
                <Input
                  id="username" name="username" type="text"
                  value={formData.username} onChange={handleChange}
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username ? 'reg-username-error' : undefined}
                  className={inputClass('username')}
                  placeholder="Username"
                  disabled={isLoading}
                />
              </div>
              {errors.username && <p id="reg-username-error" role="alert" className="mt-0.5 text-xs text-red-500">⚠️ {errors.username}</p>}
            </div>
          </div>

          {/* Email — full width */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1">
              Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 h-4 w-4" />
              <Input
                id="email" name="email" type="email"
                value={formData.email} onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'reg-email-error' : undefined}
                className={inputClass('email')}
                placeholder="email@contoh.com"
                disabled={isLoading}
              />
            </div>
            {errors.email && <p id="reg-email-error" role="alert" className="mt-0.5 text-xs text-red-500">⚠️ {errors.email}</p>}
          </div>

          {/* Kode Aktivasi — optional */}
          <div>
            <label htmlFor="activationCode" className="block text-xs font-semibold text-gray-600 mb-1">
              Kode Aktivasi <span className="text-gray-400">(opsional)</span>
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 h-4 w-4" />
              <Input
                id="activationCode" name="activationCode" type="text"
                value={formData.activationCode} onChange={handleChange}
                className="pl-9 h-10 text-sm rounded-xl border-2 border-emerald-100 bg-emerald-50/50 focus:bg-white focus:border-emerald-400 transition-colors uppercase"
                placeholder="Contoh: GURU2025"
                disabled={isLoading}
              />
            </div>
            <p className="mt-0.5 text-xs text-gray-400">Masukkan kode dari admin untuk akses penuh</p>
          </div>

          {/* Row 2: Password + Confirm side by side */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-600 mb-1">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 h-4 w-4" />
                <Input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password} onChange={handleChange}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'reg-password-error' : undefined}
                  className={`pr-9 ${inputClass('password')}`}
                  placeholder="Min 6 karakter"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                  disabled={isLoading}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p id="reg-password-error" role="alert" className="mt-0.5 text-xs text-red-500">⚠️ {errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-600 mb-1">
                Konfirmasi <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 h-4 w-4" />
                <Input
                  id="confirmPassword" name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword} onChange={handleChange}
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={errors.confirmPassword ? 'reg-confirm-error' : undefined}
                  className={`pr-9 ${inputClass('confirmPassword')}`}
                  placeholder="Ulangi"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi password' : 'Tampilkan konfirmasi password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p id="reg-confirm-error" role="alert" className="mt-0.5 text-xs text-red-500">⚠️ {errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all text-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Membuat akun...
              </span>
            ) : (
              'Buat Akun ✨'
            )}
          </Button>

          {/* Switch to Login */}
          {onSwitchToLogin && (
            <div className="text-center">
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