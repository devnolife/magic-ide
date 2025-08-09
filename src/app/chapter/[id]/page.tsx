import { notFound } from 'next/navigation';
import { ChapterOverview } from '@/components/chapters/ChapterOverview';
import { getChapterData } from '@/lib/chapters';

interface ChapterPageProps {
  params: {
    id: string;
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const chapter = await getChapterData(params.id);

  if (!chapter) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ChapterOverview chapter={chapter} />
    </div>
  );
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
