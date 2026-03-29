"use client";

import { Loader2 } from 'lucide-react';

export function LoadingAnimation() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50">
      <div className="text-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Memuat Python Learning Hub...
        </p>
      </div>
    </div>
  );
}
