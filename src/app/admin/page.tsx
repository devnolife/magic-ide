"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
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
  ClipboardList,
  KeyRound,
  Search,
  ChevronLeft,
  ChevronRight,
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

interface AuditLogEntry {
  id: string;
  action: string;
  target: string | null;
  details: string | null;
  createdAt: string;
  user: {
    name: string | null;
    username: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface RoleCounts {
  USER: number;
  TEACHER: number;
  ADMIN: number;
  ALL: number;
}

interface ActivationCodeData {
  id: string;
  code: string;
  description: string | null;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  _count: { usages: number };
}

interface CodeUsageDetail {
  id: string;
  activatedAt: string;
  user: { id: string; username: string; name: string | null; email: string };
}

const USERS_PER_PAGE = 10;

const ROLE_LABELS: Record<string, string> = {
  USER: 'Siswa',
  TEACHER: 'Guru',
  ADMIN: 'Admin',
};

const ACTION_COLORS: Record<string, string> = {
  PROGRESS_RESET: 'bg-orange-100 text-orange-700 border-orange-200',
  PASSWORD_RESET: 'bg-red-100 text-red-700 border-red-200',
  USER_DEACTIVATED: 'bg-rose-100 text-rose-700 border-rose-200',
  USER_ACTIVATED: 'bg-green-100 text-green-700 border-green-200',
  CLASSROOM_DELETED: 'bg-red-100 text-red-700 border-red-200',
  STUDENT_REMOVED: 'bg-amber-100 text-amber-700 border-amber-200',
};

function getActionColor(action: string) {
  return ACTION_COLORS[action] || 'bg-gray-100 text-gray-700 border-gray-200';
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Baru saja';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  return date.toLocaleDateString('id-ID');
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditPage, setAuditPage] = useState(1);
  const [auditHasMore, setAuditHasMore] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);

  // Search, filter, pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPagination, setUsersPagination] = useState<Pagination | null>(null);
  const [roleCounts, setRoleCounts] = useState<RoleCounts | null>(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Activation codes state
  const [activationCodes, setActivationCodes] = useState<ActivationCodeData[]>([]);
  const [showCreateCode, setShowCreateCode] = useState(false);
  const [newCode, setNewCode] = useState({ code: '', description: '', maxUses: 50, expiresAt: '' });
  const [codeUsageDetail, setCodeUsageDetail] = useState<{ code: ActivationCodeData; usages: CodeUsageDetail[] } | null>(null);
  const [showCodeUsage, setShowCodeUsage] = useState(false);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      setError('Admin access required');
      setLoading(false);
      return;
    }

    fetchAdminData();
  }, [user]);

  const fetchAuditLogs = useCallback(async (page: number, append = false) => {
    try {
      setAuditLoading(true);
      const token = localStorage.getItem('auth-token');
      const res = await fetch(`/api/admin/audit-log?page=${page}&pageSize=20`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(prev => append ? [...prev, ...data.logs] : data.logs);
        setAuditHasMore(page < data.pagination.pages);
        setAuditPage(page);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setAuditLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async (page: number, search: string, role: string) => {
    try {
      setUsersLoading(true);
      const token = localStorage.getItem('auth-token');
      const params = new URLSearchParams({
        page: String(page),
        limit: String(USERS_PER_PAGE),
      });
      if (search) params.set('search', search);
      if (role) params.set('role', role);

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setUsersPagination(data.pagination);
        if (data.roleCounts) setRoleCounts(data.roleCounts);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('auth-token');

      const statsResponse = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      await Promise.all([
        fetchUsers(1, '', ''),
        fetchAuditLogs(1),
        fetchActivationCodes(),
      ]);

    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivationCodes = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const res = await fetch('/api/admin/activation-codes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setActivationCodes(data.codes || []);
      }
    } catch (error) {
      console.error('Failed to fetch activation codes:', error);
    }
  };

  const handleCreateCode = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const res = await fetch('/api/admin/activation-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          code: newCode.code,
          description: newCode.description || null,
          maxUses: newCode.maxUses,
          expiresAt: newCode.expiresAt || null,
        }),
      });
      if (res.ok) {
        toast.success('Kode aktivasi berhasil dibuat');
        setShowCreateCode(false);
        setNewCode({ code: '', description: '', maxUses: 50, expiresAt: '' });
        fetchActivationCodes();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Gagal membuat kode');
      }
    } catch {
      toast.error('Gagal membuat kode aktivasi');
    }
  };

  const handleToggleCode = async (id: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('auth-token');
      await fetch(`/api/admin/activation-codes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !isActive }),
      });
      fetchActivationCodes();
      toast.success(isActive ? 'Kode dinonaktifkan' : 'Kode diaktifkan');
    } catch {
      toast.error('Gagal mengubah status kode');
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm('Yakin hapus kode ini?')) return;
    try {
      const token = localStorage.getItem('auth-token');
      await fetch(`/api/admin/activation-codes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchActivationCodes();
      toast.success('Kode berhasil dihapus');
    } catch {
      toast.error('Gagal menghapus kode');
    }
  };

  const handleViewUsage = async (id: string) => {
    try {
      const token = localStorage.getItem('auth-token');
      const res = await fetch(`/api/admin/activation-codes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCodeUsageDetail({ code: data.code, usages: data.code.usages || [] });
        setShowCodeUsage(true);
      }
    } catch {
      toast.error('Gagal memuat detail penggunaan');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Kode disalin ke clipboard');
  };

  // Debounced search and role filter
  useEffect(() => {
    if (loading) return;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setCurrentPage(1);
      fetchUsers(1, searchQuery, roleFilter);
    }, 300);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, roleFilter]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchUsers(newPage, searchQuery, roleFilter);
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
        setUsers(prev => prev.map(u =>
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'default' as const;
      case 'TEACHER': return 'outline' as const;
      default: return 'secondary' as const;
    }
  };

  const openResetDialog = (targetUser: User) => {
    setResetTarget(targetUser);
    setNewPassword('');
    setResetDialogOpen(true);
  };

  const handlePasswordReset = async () => {
    if (!resetTarget || !newPassword) return;

    if (newPassword.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }

    setResetting(true);
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/admin/users/${resetTarget.id}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Password untuk ${resetTarget.username} berhasil direset`);
        setResetDialogOpen(false);
        setNewPassword('');
        setResetTarget(null);
      } else {
        toast.error(data.error || 'Gagal mereset password');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mereset password');
    } finally {
      setResetting(false);
    }
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

      {/* Top Performers */}
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

      {/* User Management Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Users className="h-5 w-5" />
          Manajemen Pengguna
        </h2>

        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama, username, atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={roleFilter || 'ALL'} onValueChange={(value) => setRoleFilter(value === 'ALL' ? '' : value)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Semua Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">
                Semua {roleCounts ? `(${roleCounts.ALL})` : ''}
              </SelectItem>
              <SelectItem value="USER">
                Siswa {roleCounts ? `(${roleCounts.USER})` : ''}
              </SelectItem>
              <SelectItem value="TEACHER">
                Guru {roleCounts ? `(${roleCounts.TEACHER})` : ''}
              </SelectItem>
              <SelectItem value="ADMIN">
                Admin {roleCounts ? `(${roleCounts.ADMIN})` : ''}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* User List */}
        <div className="rounded-lg border divide-y relative">
          {usersLoading && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10 rounded-lg">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
          {users.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p>Tidak ada pengguna ditemukan.</p>
            </div>
          ) : (
            users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-foreground truncate">
                      {u.name || u.username}
                    </p>
                    {!u.isActive && (
                      <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                        Nonaktif
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  <p className="text-xs text-muted-foreground">
                    @{u.username} · {u._count.progress} progress · {u._count.challenges} tantangan
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={getRoleBadgeVariant(u.role)}>
                    {ROLE_LABELS[u.role] || u.role}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openResetDialog(u)}
                    title="Reset Password"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant={u.isActive ? "destructive" : "default"}
                    onClick={() => updateUserStatus(u.id, !u.isActive)}
                  >
                    {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {usersPagination && usersPagination.pages > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            <p className="text-sm text-muted-foreground">
              {usersPagination.total > 0
                ? `Menampilkan ${(usersPagination.page - 1) * usersPagination.limit + 1}-${Math.min(usersPagination.page * usersPagination.limit, usersPagination.total)} dari ${usersPagination.total} pengguna`
                : 'Tidak ada pengguna'}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Sebelumnya
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {currentPage} / {usersPagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= usersPagination.pages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
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

      {/* Kode Aktivasi Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-amber-600" />
            Kode Aktivasi
          </h2>
          <Button onClick={() => setShowCreateCode(true)} size="sm">
            + Buat Kode Baru
          </Button>
        </div>

        {activationCodes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <KeyRound className="h-10 w-10 mx-auto mb-2 opacity-50" />
            <p>Belum ada kode aktivasi.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activationCodes.map((ac) => (
              <div key={ac.id} className="flex items-center justify-between p-4 rounded-xl border bg-card">
                <div className="flex items-center gap-4">
                  <div className="font-mono text-lg font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => copyToClipboard(ac.code)}>
                    {ac.code}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{ac.description || 'Tanpa deskripsi'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={ac.isActive ? 'default' : 'secondary'} className={ac.isActive ? 'bg-emerald-600' : ''}>
                        {ac.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {ac.currentUses}/{ac.maxUses} digunakan
                      </span>
                      {ac.expiresAt && (
                        <span className="text-xs text-muted-foreground">
                          Exp: {new Date(ac.expiresAt).toLocaleDateString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewUsage(ac.id)}>
                    Detail
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleToggleCode(ac.id, ac.isActive)}>
                    {ac.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteCode(ac.id)}>
                    Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Audit Log Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <ClipboardList className="h-5 w-5" />
          📋 Log Aktivitas
        </h2>
        <div className="rounded-lg border">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-[140px_1fr_1fr_1fr_1fr] gap-2 p-3 border-b bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <span>Waktu</span>
            <span>Pengguna</span>
            <span>Aksi</span>
            <span>Target</span>
            <span>Detail</span>
          </div>

          {auditLogs.length === 0 && !auditLoading && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              Belum ada log aktivitas
            </div>
          )}

          <div className="divide-y">
            {auditLogs.map((log) => {
              let detailText = '-';
              if (log.details) {
                try {
                  const parsed = JSON.parse(log.details);
                  detailText = Object.entries(parsed)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(', ');
                } catch {
                  detailText = log.details;
                }
              }

              return (
                <div
                  key={log.id}
                  className="grid grid-cols-1 sm:grid-cols-[140px_1fr_1fr_1fr_1fr] gap-1 sm:gap-2 p-3 text-sm items-center"
                >
                  <span className="text-xs text-muted-foreground" title={new Date(log.createdAt).toLocaleString('id-ID')}>
                    {timeAgo(log.createdAt)}
                  </span>
                  <span className="font-medium text-foreground">
                    {log.user.name || log.user.username}
                  </span>
                  <span>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono border ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </span>
                  <span className="text-muted-foreground">
                    {log.target ? `@${log.target}` : '-'}
                  </span>
                  <span className="text-xs text-muted-foreground truncate" title={detailText}>
                    {detailText}
                  </span>
                </div>
              );
            })}
          </div>

          {auditHasMore && (
            <div className="p-3 border-t text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchAuditLogs(auditPage + 1, true)}
                disabled={auditLoading}
              >
                {auditLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Muat lebih banyak
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Activation Code Dialog */}
      <Dialog open={showCreateCode} onOpenChange={setShowCreateCode}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Kode Aktivasi Baru</DialogTitle>
            <DialogDescription>Kode akan diubah ke huruf besar otomatis.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Kode</label>
              <Input
                value={newCode.code}
                onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                placeholder="Contoh: GURU2025"
                className="mt-1 uppercase"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Deskripsi</label>
              <Input
                value={newCode.description}
                onChange={(e) => setNewCode({ ...newCode, description: e.target.value })}
                placeholder="Kode untuk guru tahun ajaran 2025"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Maksimal Penggunaan</label>
              <Input
                type="number"
                value={newCode.maxUses}
                onChange={(e) => setNewCode({ ...newCode, maxUses: parseInt(e.target.value) || 1 })}
                min={1}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tanggal Kedaluwarsa (opsional)</label>
              <Input
                type="date"
                value={newCode.expiresAt}
                onChange={(e) => setNewCode({ ...newCode, expiresAt: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCode(false)}>Batal</Button>
            <Button onClick={handleCreateCode} disabled={!newCode.code.trim()}>Buat Kode</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Code Usage Detail Dialog */}
      <Dialog open={showCodeUsage} onOpenChange={setShowCodeUsage}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Penggunaan: {codeUsageDetail?.code.code}</DialogTitle>
            <DialogDescription>
              {codeUsageDetail?.code.currentUses}/{codeUsageDetail?.code.maxUses} penggunaan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {codeUsageDetail?.usages.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">Belum ada yang menggunakan kode ini.</p>
            ) : (
              codeUsageDetail?.usages.map((usage) => (
                <div key={usage.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium">{usage.user.name || usage.user.username}</p>
                    <p className="text-xs text-muted-foreground">{usage.user.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(usage.activatedAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Reset password untuk pengguna <strong>{resetTarget?.username}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="new-password" className="text-sm font-medium">
                Password Baru
              </label>
              <Input
                id="new-password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePasswordReset();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResetDialogOpen(false)}
              disabled={resetting}
            >
              Batal
            </Button>
            <Button
              onClick={handlePasswordReset}
              disabled={resetting || newPassword.length < 6}
            >
              {resetting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
