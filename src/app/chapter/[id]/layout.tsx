import { Metadata } from 'next';
import { ReactNode } from 'react';
import { getChapterData } from '@/lib/chapters';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const chapter = await getChapterData(id);

  if (!chapter) {
    return { title: "Chapter Tidak Ditemukan" };
  }

  return {
    title: `Chapter ${chapter.id}: ${chapter.title}`,
    description: chapter.description,
    openGraph: {
      title: `Chapter ${chapter.id}: ${chapter.title}`,
      description: chapter.description,
    },
  };
}

export default function ChapterIdLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
