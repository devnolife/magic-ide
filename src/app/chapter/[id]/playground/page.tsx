import { PlaygroundContainer } from '@/components/chapters/PlaygroundContainer';
import { getChapterData } from '@/lib/chapters';
import { notFound } from 'next/navigation';

interface PlaygroundPageProps {
  params: {
    id: string;
  };
}

export default async function PlaygroundPage({ params }: PlaygroundPageProps) {
  const chapter = await getChapterData(params.id);

  if (!chapter) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PlaygroundContainer chapter={chapter} />
    </div>
  );
}
