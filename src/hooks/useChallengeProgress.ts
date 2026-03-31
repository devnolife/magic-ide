"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface DbChallenge {
  id: string;
  number: number;
  title?: string;
  difficulty?: string;
  points?: number;
}

export interface ChallengeAttemptRecord {
  challengeNumber: number;
  bestScore: number;
  completed: boolean;
}

interface UseChallengeProgressReturn {
  dbChallenges: DbChallenge[];
  attempts: ChallengeAttemptRecord[];
  loading: boolean;
  saveChallengeResult: (challengeNumber: number, score: number, timeSpent: number, code?: string) => Promise<void>;
  isChallengeCompleted: (challengeNumber: number) => boolean;
  getBestScore: (challengeNumber: number) => number;
}

export function useChallengeProgress(chapterNumber: number): UseChallengeProgressReturn {
  const [dbChallenges, setDbChallenges] = useState<DbChallenge[]>([]);
  const [attempts, setAttempts] = useState<ChallengeAttemptRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const metaRes = await fetch(`/api/chapters/${chapterNumber}/lessons`);
        if (metaRes.ok) {
          const meta = await metaRes.json();
          setDbChallenges(meta.challenges ?? []);
        }

        const token = localStorage.getItem('auth-token');
        if (token) {
          const attemptsRes = await fetch('/api/challenges', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (attemptsRes.ok) {
            const data = await attemptsRes.json();
            const attemptsArr = data.attempts ?? [];
            const grouped: Record<string, ChallengeAttemptRecord> = {};
            for (const a of attemptsArr) {
              const num = a.challenge?.number;
              if (num == null) continue;
              if (!grouped[num] || a.score > grouped[num].bestScore) {
                grouped[num] = {
                  challengeNumber: num,
                  bestScore: a.score,
                  completed: a.status === 'COMPLETED',
                };
              }
            }
            setAttempts(Object.values(grouped));
          }
        }
      } catch (err) {
        console.error(`Error loading challenge data for chapter ${chapterNumber}:`, err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [chapterNumber]);

  const saveChallengeResult = useCallback(async (
    challengeNumber: number,
    score: number,
    timeSpent: number,
    code?: string
  ) => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) return;

      const dbChallenge = dbChallenges.find(c => c.number === challengeNumber);
      if (!dbChallenge) {
        console.error('DB challenge not found for number:', challengeNumber);
        return;
      }

      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challengeId: dbChallenge.id,
          score,
          status: 'COMPLETED',
          timeSpent: Math.floor(timeSpent),
          result: { score, timeSpent },
          ...(code && { code }),
        }),
      });

      if (res.ok) {
        toast.success(`🏆 Skor ${score} tersimpan!`, { duration: 3000 });
        setAttempts(prev => {
          const existing = prev.find(a => a.challengeNumber === challengeNumber);
          if (existing) {
            return prev.map(a =>
              a.challengeNumber === challengeNumber
                ? { ...a, bestScore: Math.max(a.bestScore, score), completed: true }
                : a
            );
          }
          return [...prev, { challengeNumber, bestScore: score, completed: true }];
        });
      }
    } catch (err) {
      console.error('Error saving challenge result:', err);
    }
  }, [dbChallenges]);

  const isChallengeCompleted = useCallback(
    (challengeNumber: number) => {
      return attempts.some(a => a.challengeNumber === challengeNumber && a.completed);
    },
    [attempts]
  );

  const getBestScore = useCallback(
    (challengeNumber: number) => {
      return attempts.find(a => a.challengeNumber === challengeNumber)?.bestScore ?? 0;
    },
    [attempts]
  );

  return {
    dbChallenges,
    attempts,
    loading,
    saveChallengeResult,
    isChallengeCompleted,
    getBestScore,
  };
}
