"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

interface BackToDashboardProps {
  className?: string;
}

export function BackToDashboard({ className }: BackToDashboardProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Link href="/dashboard">
        <Button variant="outline" size="sm" className="bg-white/70 backdrop-blur-md border-white/20">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Button>
      </Link>

      <Link href="/dashboard">
        <Button variant="ghost" size="sm">
          <Home className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}
