"use client";

import { useState, useEffect, useCallback } from 'react';
import { BackToDashboard } from '@/components/dashboard/BackToDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Trophy } from 'lucide-react';
import Link from 'next/link';
import ChallengeContainer from '@/components/chapter0/challenges/ChallengeContainer';
import Challenge1RobotInstructions from '@/components/chapter0/challenges/Challenge1RobotInstructions';
import Challenge2VariableMemory from '@/components/chapter0/challenges/Challenge2VariableMemory';
import Challenge3TypeDetective from '@/components/chapter0/challenges/Challenge3TypeDetective';
import Challenge4OperationMaster from '@/components/chapter0/challenges/Challenge4OperationMaster';
import { toast } from 'sonner';

interface Chapter0ChallengesProps {
  challengeId?: string;
}

const challengesMeta = [
  {
    id: 1,
    title: "Robot Chef Instructions",
    description: "Ajari robot chef mengikuti instruksi memasak langkah demi langkah",
    icon: "🤖",
    difficulty: "beginner" as const,
    estimatedTime: "5-10 min",
    timeLimit: 300,
  },
  {
    id: 2,
    title: "Memory Warehouse Manager",
    description: "Atur data di gudang memori ajaib dengan tepat",
    icon: "📦",
    difficulty: "beginner" as const,
    estimatedTime: "10-15 min",
    timeLimit: 240,
  },
  {
    id: 3,
    title: "Data Type Detective",
    description: "Pecahkan misteri dengan mengidentifikasi tipe data",
    icon: "🔍",
    difficulty: "intermediate" as const,
    estimatedTime: "10-15 min",
    timeLimit: 180,
  },
  {
    id: 4,
    title: "Operation Master",
    description: "Kuasai seni operasi matematika dan manipulasi teks",
    icon: "⚡",
    difficulty: "advanced" as const,
    estimatedTime: "15-20 min",
    timeLimit: 360,
  }
];

interface ChallengeAttemptRecord {
  challengeNumber: number;
  bestScore: number;
  completed: boolean;
}

export function Chapter0Challenges({ challengeId }: Chapter0ChallengesProps) {
  const [dbChallenges, setDbChallenges] = useState<{ id: string; number: number }[]>([]);
  const [attempts, setAttempts] = useState<ChallengeAttemptRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Load DB challenge IDs and past attempts
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get chapter + challenge IDs from DB
        const metaRes = await fetch('/api/chapters/0/lessons');
        if (metaRes.ok) {
          const meta = await metaRes.json();
          setDbChallenges(meta.challenges ?? []);
        }

        // Load past attempts
        const token = localStorage.getItem('auth-token');
        if (token) {
          const attemptsRes = await fetch('/api/challenges', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (attemptsRes.ok) {
            const data = await attemptsRes.json();
            const attemptsArr = data.attempts ?? [];
            // Group by challenge and find best score
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
        console.error('Error loading challenge data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const saveChallengeResult = useCallback(async (challengeNumber: number, score: number, timeSpent: number) => {
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
        }),
      });

      if (res.ok) {
        toast.success(`🏆 Skor ${score} tersimpan!`, { duration: 3000 });
        // Update local attempts
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Individual challenge view
  if (challengeId) {
    const challengeNum = parseInt(challengeId);
    const meta = challengesMeta.find(c => c.id === challengeNum);

    if (!meta) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Challenge tidak ditemukan.</p>
        </div>
      );
    }

    const handleComplete = (result: { score: number; timeSpent: number }) => {
      saveChallengeResult(challengeNum, result.score, result.timeSpent);
    };

    const renderChallenge = () => {
      const commonProps = {
        difficulty: meta.difficulty,
      };

      switch (challengeNum) {
        case 1:
          return (
            <Challenge1RobotInstructions
              {...commonProps}
              onComplete={(success: boolean, score: number) => {
                if (success) handleComplete({ score, timeSpent: 0 });
              }}
            />
          );
        case 2:
          return (
            <Challenge2VariableMemory
              {...commonProps}
              onComplete={(success: boolean, score: number) => {
                if (success) handleComplete({ score, timeSpent: 0 });
              }}
            />
          );
        case 3:
          return (
            <Challenge3TypeDetective
              {...commonProps}
              onComplete={(success: boolean, score: number) => {
                if (success) handleComplete({ score, timeSpent: 0 });
              }}
            />
          );
        case 4:
          return (
            <Challenge4OperationMaster
              {...commonProps}
              onComplete={(success: boolean, score: number) => {
                if (success) handleComplete({ score, timeSpent: 0 });
              }}
            />
          );
        default:
          return <p>Challenge tidak tersedia.</p>;
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <div className="p-4">
          <BackToDashboard />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/chapter/0" className="hover:text-foreground">
              Chapter 0
            </Link>
            <span>/</span>
            <Link href="/chapter/0/challenge/1" className="hover:text-foreground">
              Tantangan
            </Link>
            <span>/</span>
            <span className="text-foreground">{meta.title}</span>
          </div>

          <ChallengeContainer
            challengeId={challengeId}
            title={meta.title}
            description={meta.description}
            difficulty={meta.difficulty}
            timeLimit={meta.timeLimit}
            onComplete={handleComplete}
          >
            {renderChallenge()}
          </ChallengeContainer>
        </div>
      </div>
    );
  }

  // Challenge list view
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="p-4">
        <BackToDashboard />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-xl mb-6">
            <span className="text-4xl">🎯</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Tantangan Chapter 0
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Uji pemahaman Anda tentang dasar-dasar pemrograman dengan tantangan interaktif
          </p>
        </div>

        {/* Challenge Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {challengesMeta.map((challenge) => {
            const attempt = attempts.find(a => a.challengeNumber === challenge.id);
            return (
              <Card key={challenge.id} className="hover:shadow-lg transition-all duration-200 group">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{challenge.icon}</div>
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {challenge.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {challenge.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant={
                      challenge.difficulty === 'beginner' ? 'secondary' :
                        challenge.difficulty === 'intermediate' ? 'default' : 'destructive'
                    }>
                      {challenge.difficulty === 'beginner' ? 'Pemula' :
                        challenge.difficulty === 'intermediate' ? 'Menengah' : 'Mahir'}
                    </Badge>
                    <span className="text-muted-foreground">{challenge.estimatedTime}</span>
                  </div>

                  {/* Best score if attempted */}
                  {attempt && (
                    <div className="flex items-center gap-2 text-sm bg-green-50 p-2 rounded-lg">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="text-green-700">
                        Skor terbaik: <strong>{attempt.bestScore}</strong>
                      </span>
                    </div>
                  )}

                  {/* Action */}
                  <Link href={`/chapter/0/challenge/${challenge.id}`}>
                    <Button className="w-full">
                      {attempt ? 'Coba Lagi' : 'Mulai Tantangan'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Back to Chapter */}
        <div className="flex justify-center mt-12">
          <Link href="/chapter/0">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Chapter 0
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
