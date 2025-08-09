import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Trophy, Play } from 'lucide-react';
import { getAllChapters } from '@/lib/chapters';

export default async function ChaptersPage() {
  const chapters = await getAllChapters();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Python Learning Journey</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Master Python programming through interactive lessons, challenges, and hands-on practice
        </p>
      </div>

      {/* Chapters Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter) => (
          <Card key={chapter.id} className="hover:shadow-lg transition-all duration-200 group">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge
                  variant={
                    chapter.difficulty === 'beginner' ? 'secondary' :
                      chapter.difficulty === 'intermediate' ? 'default' :
                        'destructive'
                  }
                >
                  {chapter.difficulty}
                </Badge>
                {chapter.isLocked && <Badge variant="outline">Locked</Badge>}
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {chapter.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {chapter.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{chapter.estimatedTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{chapter.lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  <span>{chapter.challenges.length} challenges</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Link href={`/chapter/${chapter.id}`} className="flex-1">
                  <Button
                    className="w-full gap-2"
                    disabled={chapter.isLocked}
                  >
                    <Play className="w-4 h-4" />
                    {chapter.isLocked ? 'Locked' : 'Start Chapter'}
                  </Button>
                </Link>
                <Link href={`/chapter/${chapter.id}/playground`}>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={chapter.isLocked}
                    title="Open Playground"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Overview */}
      <div className="bg-muted/50 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">0/6</div>
            <div className="text-sm text-muted-foreground">Chapters Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">0</div>
            <div className="text-sm text-muted-foreground">Lessons Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">0</div>
            <div className="text-sm text-muted-foreground">Challenges Solved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">0h</div>
            <div className="text-sm text-muted-foreground">Time Spent</div>
          </div>
        </div>
      </div>
    </div>
  );
}
