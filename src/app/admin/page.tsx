"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  BookOpen,
  Clock,
  TrendingUp,
  UserCheck,
  Award,
  Target,
  Loader2,
  ShieldX,
} from 'lucide-react';

interface AdminStats {
  overview: {
    totalUsers: number;
    activeUsers: number;
    recentRegistrations: number;
    totalSessions: number;
    totalChallengeAttempts: number;
    completedChallenges: number;
    totalTimeSpent: number;
    challengeCompletionRate: number;
  };
  topPerformers: Array<{
    id: string;
    username: string;
    name: string;
    totalPoints: number;
    totalCompletedLessons: number;
    totalCompletedChallenges: number;
  }>;
  dailyActiveUsers: Array<{
    date: string;
    activeUsers: number;
  }>;
}

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    progress: number;
    challenges: number;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      setError('Admin access required');
      setLoading(false);
      return;
    }

    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('auth-token');

      const [statsResponse, usersResponse] = await Promise.all([
        fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/admin/users?limit=20', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users);
      }

    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('auth-token');

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, isActive }),
      });

      if (response.ok) {
        setUsers(users.map(u =>
          u.id === userId ? { ...u, isActive } : u
        ));
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <ShieldX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            {error || 'Administrator privileges required to access this page.'}
          </p>
        </div>
      </div>
    );
  }

  const statItems = [
    { label: 'Total Users', value: stats?.overview.totalUsers ?? 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Active Users', value: stats?.overview.activeUsers ?? 0, icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Challenge Attempts', value: stats?.overview.totalChallengeAttempts ?? 0, icon: Target, color: 'text-violet-600', bg: 'bg-violet-100' },
    { label: 'Completion Rate', value: `${stats?.overview.challengeCompletionRate ?? 0}%`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const summaryItems = [
    { label: 'Total Learning Time', value: formatTime(stats?.overview.totalTimeSpent ?? 0), icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'New Users (30 days)', value: stats?.overview.recentRegistrations ?? 0, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Sessions', value: stats?.overview.totalSessions ?? 0, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Kelola pengguna dan pantau performa platform</p>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-4 rounded-lg border p-4">
                <div className={`p-2.5 rounded-lg ${item.bg}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Top Performers & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performers
            </h2>
            <div className="rounded-lg border divide-y">
              {stats.topPerformers.slice(0, 8).map((performer, index) => (
                <div key={performer.id} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-foreground">{performer.name || performer.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {performer.totalCompletedLessons} lessons, {performer.totalCompletedChallenges} challenges
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{performer.totalPoints} pts</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Users
          </h2>
          <div className="rounded-lg border divide-y">
            {users.slice(0, 8).map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="font-medium text-sm text-foreground">{u.name || u.username}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {u.role}
                  </Badge>
                  <Button
                    size="sm"
                    variant={u.isActive ? "destructive" : "default"}
                    onClick={() => updateUserStatus(u.id, !u.isActive)}
                  >
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center gap-2 rounded-lg border p-6 text-center">
                <div className={`p-2.5 rounded-lg ${item.bg}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <p className="text-2xl font-bold text-foreground">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
