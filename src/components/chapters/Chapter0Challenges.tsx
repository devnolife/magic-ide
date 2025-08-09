"use client";

import { useState } from 'react';
import { BackToDashboard } from '@/components/dashboard/BackToDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Chapter0ChallengesProps {
  challengeId?: string;
}

const challenges = [
  {
    id: 1,
    title: "Robot Chef Instructions",
    description: "Teach robot chef to follow cooking instructions step by step",
    icon: "🤖",
    difficulty: "Easy",
    estimatedTime: "5-10 min"
  },
  {
    id: 2,
    title: "Memory Warehouse Manager",
    description: "Organize data in the magical memory warehouse",
    icon: "📦",
    difficulty: "Medium",
    estimatedTime: "10-15 min"
  },
  {
    id: 3,
    title: "Data Type Detective",
    description: "Solve mysteries by identifying different data types",
    icon: "🔍",
    difficulty: "Medium",
    estimatedTime: "10-15 min"
  },
  {
    id: 4,
    title: "Operation Master",
    description: "Master the art of mathematical and text operations",
    icon: "⚡",
    difficulty: "Hard",
    estimatedTime: "15-20 min"
  }
];

export function Chapter0Challenges({ challengeId }: Chapter0ChallengesProps) {
  if (challengeId) {
    const challenge = challenges.find(c => c.id === parseInt(challengeId));

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
        <div className="p-4">
          <BackToDashboard />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/chapter/0" className="hover:text-foreground">
              Chapter 0
            </Link>
            <span>/</span>
            <span className="text-foreground">Challenge: {challenge?.title}</span>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{challenge?.icon}</div>
                  <div>
                    <CardTitle className="text-2xl">{challenge?.title}</CardTitle>
                    <p className="text-muted-foreground mt-1">{challenge?.description}</p>
                  </div>
                </div>
                <Link href="/chapter/0">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Chapter
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-xl font-semibold mb-2">Challenge Coming Soon!</h3>
                <p className="text-muted-foreground">
                  This challenge is currently under development. Please check back later!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            Chapter 0 Challenges
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Test your knowledge of programming basics with these interactive challenges
          </p>
        </div>

        {/* Challenge Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
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
                    challenge.difficulty === 'Easy' ? 'secondary' :
                      challenge.difficulty === 'Medium' ? 'default' : 'destructive'
                  }>
                    {challenge.difficulty}
                  </Badge>
                  <span className="text-muted-foreground">{challenge.estimatedTime}</span>
                </div>

                {/* Action */}
                <Link href={`/chapter/0/challenge/${challenge.id}`}>
                  <Button className="w-full">
                    Start Challenge
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Back to Chapter */}
        <div className="flex justify-center mt-12">
          <Link href="/chapter/0">
            <Button variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Chapter 0
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
