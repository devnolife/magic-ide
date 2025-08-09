import { notFound } from 'next/navigation';
import { Chapter0Challenges } from '@/components/chapters/Chapter0Challenges';

interface ChallengePageProps {
  params: {
    id: string;
    challengeId: string;
  };
}

const challengeComponents = {
  '0': Chapter0Challenges,
  // Add other chapters as needed
};

export default async function ChallengePage({ params }: ChallengePageProps) {
  const ChallengeComponent = challengeComponents[params.id as keyof typeof challengeComponents];

  if (!ChallengeComponent) {
    notFound();
  }

  return <ChallengeComponent challengeId={params.challengeId} />;
}

export async function generateStaticParams({ params }: { params: { id: string } }) {
  // Generate static params for all challenges in a chapter
  if (params.id === '0') {
    return [
      { challengeId: '1' },
      { challengeId: '2' },
      { challengeId: '3' },
      { challengeId: '4' },
    ];
  }

  return [];
}
