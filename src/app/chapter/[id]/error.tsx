"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ChapterError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Chapter error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-6 text-destructive" />
          </div>
          <CardTitle>Gagal Memuat Chapter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Terjadi kesalahan saat memuat halaman chapter ini. Silakan coba lagi
            atau kembali ke dashboard.
          </p>
          {error.message && (
            <pre className="rounded-md bg-muted p-3 text-left text-xs text-muted-foreground overflow-auto max-h-24">
              {error.message}
            </pre>
          )}
          <div className="flex justify-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard">
                <Home className="size-4" />
                Dashboard
              </Link>
            </Button>
            <Button onClick={reset} className="gap-2">
              <RotateCcw className="size-4" />
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
