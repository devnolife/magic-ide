import { notFound } from 'next/navigation';
import { ChallengeContainer } from '@/components/chapters/ChallengeContainer';
import { getChapterData, getChallengeData } from '@/lib/chapters';

interface ChallengePageProps {
  params: {
    id: string;
    challengeId: string;
  };
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const chapter = await getChapterData(params.id);
  const challenge = await getChallengeData(params.id, params.challengeId);

  if (!chapter || !challenge) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ChallengeContainer chapter={chapter} challenge={challenge} />
    </div>
  );
}

export async function generateStaticParams({ params }: { params: { id: string } }) {
  // Generate static params for all challenges in a chapter
  const challenges = await getChallengeData(params.id);
  return challenges.map((challenge: any) => ({
    challengeId: challenge.id,
  }));
}
