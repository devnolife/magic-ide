"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Lock, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
}

type ThemeVariant = "neutral" | "emerald" | "blue";

const themeStyles: Record<
  ThemeVariant,
  {
    iconBg: string;
    badge: string;
    button: string;
    accent: string;
  }
> = {
  neutral: {
    iconBg: "bg-muted",
    badge: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    button: "",
    accent: "text-foreground",
  },
  emerald: {
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    badge:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    button:
      "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600",
    accent: "text-emerald-700 dark:text-emerald-400",
  },
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    badge:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    button:
      "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
    accent: "text-blue-700 dark:text-blue-400",
  },
};

const roleLabels: Record<string, string> = {
  USER: "Siswa",
  TEACHER: "Guru",
  ADMIN: "Administrator",
};

interface ProfileFormProps {
  theme?: ThemeVariant;
}

export default function ProfileForm({ theme = "neutral" }: ProfileFormProps) {
  const styles = themeStyles[theme];

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("auth-token");
        if (!token) {
          toast.error("Sesi tidak ditemukan. Silakan login kembali.");
          return;
        }

        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          toast.error("Gagal memuat profil.");
          return;
        }

        const data = await res.json();
        setUser(data.user);
        setName(data.user.name || "");
      } catch {
        toast.error("Gagal memuat profil.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword && newPassword !== confirmPassword) {
      toast.error("Password baru dan konfirmasi password tidak cocok.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter.");
      return;
    }

    if (newPassword && !currentPassword) {
      toast.error("Masukkan password saat ini untuk mengubah password.");
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        toast.error("Sesi tidak ditemukan. Silakan login kembali.");
        return;
      }

      const body: Record<string, string> = {};
      if (name !== (user?.name || "")) {
        body.name = name;
      }
      if (newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }

      if (Object.keys(body).length === 0) {
        toast.info("Tidak ada perubahan untuk disimpan.");
        return;
      }

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal memperbarui profil.");
        return;
      }

      setUser(data.user);
      setName(data.user.name || "");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Profil berhasil diperbarui! 🎉");
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Gagal memuat data profil.
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`rounded-lg p-2 ${styles.iconBg}`}>
              <User className={`size-5 ${styles.accent}`} />
            </div>
            Informasi Akun
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={user.username} disabled />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user.email} disabled />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Peran</Label>
              <div>
                <Badge variant="secondary" className={styles.badge}>
                  {roleLabels[user.role] || user.role}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bergabung Sejak</Label>
              <Input
                value={new Date(user.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                disabled
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
            />
          </div>
        </CardContent>
      </Card>

      {/* Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`rounded-lg p-2 ${styles.iconBg}`}>
              <Lock className={`size-5 ${styles.accent}`} />
            </div>
            Ubah Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Password Saat Ini</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Masukkan password saat ini"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Password Baru</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className={styles.button}
        >
          {saving ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Save className="mr-2 size-4" />
          )}
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
