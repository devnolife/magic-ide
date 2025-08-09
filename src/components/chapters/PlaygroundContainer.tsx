import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Code, Play } from 'lucide-react';
import Link from 'next/link';
import { Chapter } from '@/lib/chapters';
import { LearningPlatform } from '@/components/LearningPlatform';

interface PlaygroundContainerProps {
  chapter: Chapter;
}

export function PlaygroundContainer({ chapter }: PlaygroundContainerProps) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href={`/chapter/${chapter.id}`} className="hover:text-foreground">
          {chapter.title}
        </Link>
        <span>/</span>
        <span className="text-foreground">Playground</span>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1">
              <Code className="w-3 h-3" />
              Interactive Playground
            </Badge>
          </div>

          <Link href={`/chapter/${chapter.id}`}>
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Chapter
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold">{chapter.title} Playground</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Experiment with code and see real-time visualizations
          </p>
        </div>
      </div>

      <Separator />

      {/* Playground Content */}
      <div className="min-h-[600px]">
        <LearningPlatform />
      </div>

      {/* Quick Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Examples</CardTitle>
          <CardDescription>Try these examples to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="font-medium mb-2">Create a List</div>
                <div className="bg-muted p-2 rounded text-sm">
                  <code>my_list = [1, 2, 3]</code>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="font-medium mb-2">Add Items</div>
                <div className="bg-muted p-2 rounded text-sm">
                  <code>my_list.append(4)</code>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="font-medium mb-2">Remove Items</div>
                <div className="bg-muted p-2 rounded text-sm">
                  <code>my_list.remove(2)</code>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
