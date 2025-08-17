'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Jika user sudah login, redirect ke dashboard
    if (!isLoading && isAuthenticated && user) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Tampilkan loading saat mengecek auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Jika user belum login, tampilkan halaman login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Selamat Datang
            </h1>
            <p className="text-gray-600">
              Masuk ke Python Learning Platform
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    );
  }

  // Fallback - seharusnya tidak sampai ke sini karena sudah ada redirect di useEffect
  return null;
}
