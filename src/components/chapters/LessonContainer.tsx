import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Chapter, Lesson } from '@/lib/chapters';

interface LessonContainerProps {
  chapter: Chapter;
  lesson: Lesson;
}

export function LessonContainer({ chapter, lesson }: LessonContainerProps) {
  const currentLessonIndex = chapter.lessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentLessonIndex > 0 ? chapter.lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < chapter.lessons.length - 1 ? chapter.lessons[currentLessonIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/chapter/${chapter.id}`} className="hover:text-foreground">
          {chapter.title}
        </Link>
        <span>/</span>
        <span className="text-foreground">{lesson.title}</span>
      </div>

      {/* Lesson Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline">
              <BookOpen className="w-3 h-3 mr-1" />
              Lesson {lesson.order}
            </Badge>
            {lesson.isCompleted && <Badge variant="default">Completed</Badge>}
          </div>
          <Link href={`/chapter/${chapter.id}/playground`}>
            <Button variant="outline" size="sm">
              Open Playground
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <p className="text-lg text-muted-foreground mt-2">{lesson.description}</p>
        </div>
      </div>

      <Separator />

      {/* Lesson Content */}
      <Card>
        <CardHeader>
          <CardTitle>Lesson Content</CardTitle>
          <CardDescription>Learn step by step</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none">
          <div className="whitespace-pre-wrap">{lesson.content}</div>

          {/* Interactive Exercises would go here */}
          {lesson.exercises.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold">Practice Exercises</h3>
              {lesson.exercises.map((exercise, index) => (
                <Card key={exercise.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">Exercise {index + 1}</CardTitle>
                    <CardDescription>{exercise.prompt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted p-4 rounded-lg">
                      <pre><code>{exercise.starterCode}</code></pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <div>
          {prevLesson && (
            <Link href={`/chapter/${chapter.id}/lesson/${prevLesson.id}`}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Previous: {prevLesson.title}
              </Button>
            </Link>
          )}
        </div>

        <div>
          {nextLesson && (
            <Link href={`/chapter/${chapter.id}/lesson/${nextLesson.id}`}>
              <Button className="gap-2">
                Next: {nextLesson.title}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
