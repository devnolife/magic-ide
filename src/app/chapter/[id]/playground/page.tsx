import { PlaygroundContainer } from '@/components/chapters/PlaygroundContainer';
import { getChapterData } from '@/lib/chapters';
import { notFound } from 'next/navigation';

interface PlaygroundPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PlaygroundPage({ params }: PlaygroundPageProps) {
  const { id } = await params;
  const chapter = await getChapterData(id);

  if (!chapter) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PlaygroundContainer chapter={chapter} />
    </div>
  );
}
