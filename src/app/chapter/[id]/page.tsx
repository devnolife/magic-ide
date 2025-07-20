import { LearningPlatform } from '@/components/LearningPlatform';
import { redirect } from 'next/navigation';

interface ChapterPageProps {
  params: { id: string };
}

export default function ChapterPage({ params }: ChapterPageProps) {
  const chapterId = parseInt(params.id);

  // For now, redirect chapter 1 to the existing chapter1 route
  // and show the learning platform for other chapters
  if (chapterId === 1) {
    redirect('/chapter1');
  }

  // For chapters 2-5, show the learning platform (list operations)
  return <LearningPlatform />;
}
