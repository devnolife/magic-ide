'use client';

import { Editor } from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRun: () => void;
  onReset: () => void;
  height?: string;
  className?: string;
}

export function CodeEditor({
  code,
  onCodeChange,
  onRun,
  onReset,
  height = "400px",
  className = ""
}: CodeEditorProps) {
  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Python Code Editor</CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onRun}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Run
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <div className={`h-full border rounded-lg overflow-hidden`} style={{ height: height }}>
          <Editor
            height={height}
            defaultLanguage="python"
            value={code}
            onChange={(value) => onCodeChange(value || '')}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              insertSpaces: true,
              wordWrap: 'on',
              folding: true,
              lineDecorationsWidth: 10,
              lineNumbersMinChars: 3,
              padding: { top: 16, bottom: 16 },
              bracketPairColorization: { enabled: true },
              quickSuggestions: {
                other: true,
                comments: true,
                strings: true
              }
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
