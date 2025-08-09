import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, BookOpen, Trophy } from 'lucide-react';
import { Chapter } from '@/lib/chapters';

interface ChapterOverviewProps {
  chapter: Chapter;
}

export function ChapterOverview({ chapter }: ChapterOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Chapter Header */}
      <div className="text-center space-y-4">
        <Badge variant={chapter.difficulty === 'beginner' ? 'secondary' : chapter.difficulty === 'intermediate' ? 'default' : 'destructive'}>
          {chapter.difficulty}
        </Badge>
        <h1 className="text-4xl font-bold">{chapter.title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {chapter.description}
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{chapter.estimatedTime} minutes</span>
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
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4">
        <Link href={`/chapter/${chapter.id}/lesson/1`}>
          <Button size="lg" className="gap-2">
            <Play className="w-4 h-4" />
            Start Learning
          </Button>
        </Link>
        <Link href={`/chapter/${chapter.id}/playground`}>
          <Button variant="outline" size="lg">
            Open Playground
          </Button>
        </Link>
      </div>

      {/* Lessons Grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Lessons</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapter.lessons.map((lesson) => (
            <Card key={lesson.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge variant="outline">Lesson {lesson.order}</Badge>
                  {lesson.isCompleted && <Badge variant="default">Completed</Badge>}
                </div>
                <CardTitle className="text-lg">{lesson.title}</CardTitle>
                <CardDescription>{lesson.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/chapter/${chapter.id}/lesson/${lesson.id}`}>
                  <Button className="w-full">
                    {lesson.isCompleted ? 'Review' : 'Start'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      {chapter.challenges.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Challenges</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapter.challenges.map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge
                      variant={
                        challenge.difficulty === 'easy' ? 'secondary' :
                          challenge.difficulty === 'medium' ? 'default' :
                            'destructive'
                      }
                    >
                      {challenge.difficulty}
                    </Badge>
                    <Trophy className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/chapter/${chapter.id}/challenge/${challenge.id}`}>
                    <Button variant="outline" className="w-full">
                      Take Challenge
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
