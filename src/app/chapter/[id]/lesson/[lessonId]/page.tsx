import { notFound } from 'next/navigation';
import { LessonContainer } from '@/components/chapters/LessonContainer';
import { getChapterData, getLessonData, getAllChapters } from '@/lib/chapters';

interface LessonPageProps {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id, lessonId } = await params;
  const chapter = await getChapterData(id);
  const lesson = await getLessonData(id, lessonId);

  if (!chapter || !lesson) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LessonContainer chapter={chapter} lesson={lesson} />
    </div>
  );
}

export async function generateStaticParams() {
  const chapters = await getAllChapters();
  const params: { id: string; lessonId: string }[] = [];
  for (const chapter of chapters) {
    for (const lesson of chapter.lessons) {
      params.push({ id: chapter.id, lessonId: lesson.id });
    }
  }
  return params;
}
