import { notFound } from 'next/navigation';
import { LessonContainer } from '@/components/chapters/LessonContainer';
import { getChapterData, getLessonData } from '@/lib/chapters';

interface LessonPageProps {
  params: {
    id: string;
    lessonId: string;
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const chapter = await getChapterData(params.id);
  const lesson = await getLessonData(params.id, params.lessonId);

  if (!chapter || !lesson) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LessonContainer chapter={chapter} lesson={lesson} />
    </div>
  );
}

export async function generateStaticParams({ params }: { params: { id: string } }) {
  // Generate static params for all lessons in a chapter
  const lessons = await getLessonData(params.id);
  return lessons.map((lesson: any) => ({
    lessonId: lesson.id,
  }));
}
