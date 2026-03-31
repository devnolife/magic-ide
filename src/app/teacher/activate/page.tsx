"use client";

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { KeyRound, Lock, Unlock, BookOpen, Users, ClipboardList, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function TeacherActivatePage() {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [activated, setActivated] = useState(false);

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Masukkan kode aktivasi');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('auth-token');
      const res = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activationCode: code }),
      });

      const data = await res.json();

      if (res.ok) {
        // Update token in localStorage and cookie
        if (data.token) {
          localStorage.setItem('auth-token', data.token);
          document.cookie = `auth-token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        }
        setActivated(true);
        toast.success('🎉 Aktivasi berhasil! Anda sekarang memiliki akses penuh.');
      } else {
        toast.error(data.error || 'Gagal mengaktivasi');
      }
    } catch {
      toast.error('Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (activated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-md mx-auto text-center border-emerald-200 bg-emerald-50/50">
            <CardContent className="pt-8 pb-8 space-y-4">
              <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-emerald-800">Aktivasi Berhasil! 🎉</h2>
              <p className="text-emerald-700">
                Akun Anda sekarang memiliki akses penuh ke semua fitur platform.
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <Link href="/teacher">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Ke Dashboard
                  </Button>
                </Link>
                <Link href="/teacher/materials">
                  <Button variant="outline">
                    Lihat Materi
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const lockedFeatures = [
    { icon: BookOpen, label: 'Materi Chapter 2-5', desc: 'Akses semua materi lanjutan' },
    { icon: Users, label: 'Kelola Kelas', desc: 'Buat dan kelola kelas siswa' },
    { icon: ClipboardList, label: 'Sesi Ujian', desc: 'Buat dan kelola sesi ujian' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back link */}
      <Link href="/teacher" className="inline-flex items-center text-sm text-muted-foreground hover:text-emerald-600 transition-colors">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Kembali ke Dashboard
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <KeyRound className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-900">Aktivasi Akun Guru</h1>
                <p className="text-amber-700">
                  Halo {user?.name || user?.username}! Masukkan kode aktivasi untuk membuka semua fitur.
                </p>
              </div>
            </div>

            <form onSubmit={handleActivate} className="flex gap-3">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Masukkan kode aktivasi (contoh: GURU2025)"
                className="flex-1 h-12 text-lg font-mono uppercase border-amber-200 bg-white focus:border-amber-400"
                disabled={loading}
              />
              <Button
                type="submit"
                className="h-12 px-6 bg-amber-600 hover:bg-amber-700 text-white"
                disabled={loading || !code.trim()}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Unlock className="h-4 w-4" />
                    Aktivasi
                  </span>
                )}
              </Button>
            </form>

            <p className="text-xs text-amber-600 mt-2">
              💡 Dapatkan kode aktivasi dari administrator sekolah Anda.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Current access info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Akses Anda Saat Ini
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50">
              <Unlock className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-800">✅ Dashboard Guru</p>
                <p className="text-xs text-emerald-600">Lihat ringkasan dan statistik</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50">
              <Unlock className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-800">✅ Materi Chapter 0 & 1</p>
                <p className="text-xs text-emerald-600">Dasar Pemrograman & Pengenalan Lists</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Locked features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="h-4 w-4 text-gray-400" />
              Fitur Terkunci
              <Badge variant="secondary" className="text-xs">Butuh Aktivasi</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lockedFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.label} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 opacity-60">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500">🔒 {feature.label}</p>
                    <p className="text-xs text-gray-400">{feature.desc}</p>
                  </div>
                  <Icon className="h-5 w-5 text-gray-300" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
