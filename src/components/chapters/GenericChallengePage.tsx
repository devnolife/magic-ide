"use client";

import { BackToDashboard } from '@/components/dashboard/BackToDashboard';
import { ChallengeContainer } from './ChallengeContainer';
import { Chapter, Challenge } from '@/lib/chapters';

interface GenericChallengePageProps {
  chapter: Chapter;
  challenge: Challenge;
}

export function GenericChallengePage({ chapter, challenge }: GenericChallengePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="p-4">
        <BackToDashboard />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ChallengeContainer chapter={chapter} challenge={challenge} />
      </div>
    </div>
  );
}
