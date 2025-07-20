import { LearningPlatform } from '@/components/LearningPlatform';

export default function ChapterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div>
      {children}
    </div>
  );
}
