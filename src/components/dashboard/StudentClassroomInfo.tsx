'use client';

import { useEffect, useState } from 'react';
import { School, Users, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ClassroomInfo {
  id: string;
  name: string;
  description: string | null;
  teacherName: string;
  studentCount: number;
}

function ClassroomSkeleton() {
  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="size-5 rounded-full" />
        <Skeleton className="h-5 w-28" />
      </div>
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {[1, 2].map((i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-6 w-24 rounded-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function StudentClassroomInfo() {
  const [classrooms, setClassrooms] = useState<ClassroomInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('auth-token');
        if (!token) return;

        const res = await fetch('/api/student/classroom', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setClassrooms(data.classrooms ?? []);
      } catch {
        setError('Gagal memuat data kelas');
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  if (loading) return <ClassroomSkeleton />;

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="size-4 text-yellow-500" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (classrooms.length === 0) return null;

  return (
    <div className="px-4 lg:px-6">
      <div className="flex items-center gap-2 mb-3">
        <School className="size-5 text-blue-500" />
        <h2 className="text-lg font-semibold">Kelas Saya</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {classrooms.map((cls) => (
          <Card key={cls.id} className="@container/card bg-gradient-to-t from-blue-500/5 to-card">
            <CardHeader>
              <CardDescription className="flex items-center gap-1.5">
                <School className="size-3.5" />
                Guru: {cls.teacherName}
              </CardDescription>
              <CardTitle className="text-base font-semibold">{cls.name}</CardTitle>
            </CardHeader>
            <CardFooter>
              <Badge variant="outline">
                <Users className="size-3 mr-1" />
                {cls.studentCount} siswa
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
