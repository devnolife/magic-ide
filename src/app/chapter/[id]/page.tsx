import { notFound } from 'next/navigation';
import { Chapter0Page } from '@/components/chapters/Chapter0Page';
import { Chapter1Page } from '@/components/chapters/Chapter1Page';
import { Chapter2Page } from '@/components/chapters/Chapter2Page';
import { Chapter3Page } from '@/components/chapters/Chapter3Page';
import { Chapter4Page } from '@/components/chapters/Chapter4Page';
import { Chapter5Page } from '@/components/chapters/Chapter5Page';

interface ChapterPageProps {
  params: {
    id: string;
  };
}

const chapterComponents = {
  '0': Chapter0Page,
  '1': Chapter1Page,
  '2': Chapter2Page,
  '3': Chapter3Page,
  '4': Chapter4Page,
  '5': Chapter5Page,
};

export default async function ChapterPage({ params }: ChapterPageProps) {
  const ChapterComponent = chapterComponents[params.id as keyof typeof chapterComponents];

  if (!ChapterComponent) {
    notFound();
  }

  return <ChapterComponent />;
}

export async function generateStaticParams() {
  // Generate static params for all available chapters
  return [
    { id: '0' },
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}
