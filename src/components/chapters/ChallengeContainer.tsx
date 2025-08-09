import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Trophy, Lightbulb, Play, Check } from 'lucide-react';
import Link from 'next/link';
import { Chapter, Challenge } from '@/lib/chapters';
import { CodeEditor } from '@/components/CodeEditor';

interface ChallengeContainerProps {
  chapter: Chapter;
  challenge: Challenge;
}

export function ChallengeContainer({ chapter, challenge }: ChallengeContainerProps) {
  const [code, setCode] = useState(challenge.starterCode);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleRunCode = () => {
    // Here you would implement code execution and testing
    console.log('Running code:', code);
  };

  const handleSubmit = () => {
    // Here you would implement solution validation
    console.log('Submitting solution:', code);
    setIsCompleted(true);
  };

  const nextHint = () => {
    if (currentHint < challenge.hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/chapter/${chapter.id}`} className="hover:text-foreground">
          {chapter.title}
        </Link>
        <span>/</span>
        <span className="text-foreground">Challenge: {challenge.title}</span>
      </div>

      {/* Challenge Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge
              variant={
                challenge.difficulty === 'easy' ? 'secondary' :
                  challenge.difficulty === 'medium' ? 'default' :
                    'destructive'
              }
            >
              <Trophy className="w-3 h-3 mr-1" />
              {challenge.difficulty}
            </Badge>
            {isCompleted && <Badge variant="default" className="gap-1">
              <Check className="w-3 h-3" />
              Completed
            </Badge>}
          </div>

          <Link href={`/chapter/${chapter.id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Chapter
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{challenge.title}</h1>
          <p className="text-lg text-muted-foreground mt-2">{challenge.description}</p>
        </div>
      </div>

      <Separator />

      {/* Challenge Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Instructions & Hints */}
        <div className="space-y-4">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              <CardDescription>Complete this challenge to test your skills</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap">{challenge.description}</div>
            </CardContent>
          </Card>

          {/* Test Cases */}
          {challenge.testCases.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Test Cases</CardTitle>
                <CardDescription>Your solution should pass these tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {challenge.testCases.map((testCase, index) => (
                    <div key={index} className="bg-muted p-3 rounded-lg">
                      <div className="text-sm font-medium">Test Case {index + 1}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {testCase.description}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hints */}
          {challenge.hints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Hints
                </CardTitle>
                <CardDescription>
                  Stuck? Get some hints to guide you
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showHints ? (
                  <Button
                    variant="outline"
                    onClick={() => setShowHints(true)}
                    className="gap-2"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Show Hints
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                      <div className="text-sm font-medium text-yellow-800">
                        Hint {currentHint + 1} of {challenge.hints.length}
                      </div>
                      <div className="text-sm text-yellow-700 mt-1">
                        {challenge.hints[currentHint]}
                      </div>
                    </div>
                    {currentHint < challenge.hints.length - 1 && (
                      <Button variant="outline" size="sm" onClick={nextHint}>
                        Next Hint
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Code Editor</CardTitle>
              <CardDescription>Write your solution here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <CodeEditor
                  code={code}
                  onCodeChange={setCode}
                  onRun={handleRunCode}
                  onReset={() => setCode(challenge.starterCode)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleRunCode} variant="outline" className="gap-2">
              <Play className="w-4 h-4" />
              Run Code
            </Button>
            <Button onClick={handleSubmit} className="gap-2" disabled={isCompleted}>
              {isCompleted ? (
                <>
                  <Check className="w-4 h-4" />
                  Completed
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4" />
                  Submit Solution
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
