import { ReactNode } from 'react';

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
