import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: "Daftar Chapter",
  description: "Jelajahi semua chapter pembelajaran Python dari dasar hingga mahir.",
};

interface ChapterLayoutProps {
  children: ReactNode;
}

export default function ChapterLayout({ children }: ChapterLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
