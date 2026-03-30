import { notFound } from 'next/navigation';
import { Chapter0Challenges } from '@/components/chapters/Chapter0Challenges';
import { GenericChallengePage } from '@/components/chapters/GenericChallengePage';
import { getChapterData, getChallengeData, Challenge } from '@/lib/chapters';

interface ChallengePageProps {
  params: Promise<{
    id: string;
    challengeId: string;
  }>;
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { id, challengeId } = await params;

  // Chapter 0 has its own custom interactive challenges
  if (id === '0') {
    return <Chapter0Challenges challengeId={challengeId} />;
  }

  // Chapters 1-5 use the reusable ChallengeContainer with data from chapters.ts
  const chapter = await getChapterData(id);
  if (!chapter) {
    notFound();
  }

  const challenge = await getChallengeData(id, challengeId);
  if (!challenge || Array.isArray(challenge)) {
    notFound();
  }

  return <GenericChallengePage chapter={chapter} challenge={challenge as Challenge} />;
}

export async function generateStaticParams() {
  // Chapter 0 has 4 custom interactive challenges
  const chapter0Params = [
    { id: '0', challengeId: '1' },
    { id: '0', challengeId: '2' },
    { id: '0', challengeId: '3' },
    { id: '0', challengeId: '4' },
  ];

  // Chapters 1-5: generate params from challenge data
  const otherParams: { id: string; challengeId: string }[] = [];
  for (const chapterId of ['1', '2', '3', '4', '5']) {
    const chapter = await getChapterData(chapterId);
    if (chapter) {
      for (const challenge of chapter.challenges) {
        otherParams.push({ id: chapterId, challengeId: challenge.id });
      }
    }
  }

  return [...chapter0Params, ...otherParams];
}
