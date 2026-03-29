"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { School, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function CreateClassroomPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const token = localStorage.getItem("auth-token");
      const res = await fetch("/api/classrooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (res.ok) {
        setFeedback({
          type: "success",
          message: "Kelas berhasil dibuat! Mengalihkan...",
        });
        setTimeout(() => {
          router.push("/teacher/classrooms");
        }, 1500);
      } else {
        const err = await res.json();
        setFeedback({
          type: "error",
          message: err.error || "Gagal membuat kelas. Silakan coba lagi.",
        });
      }
    } catch {
      setFeedback({
        type: "error",
        message: "Terjadi kesalahan jaringan. Silakan coba lagi.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-xl mx-auto space-y-6"
    >
      {/* Back link */}
      <Link
        href="/teacher/classrooms"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Kelas
      </Link>

      <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white shadow-md">
              <School className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl">Buat Kelas Baru</CardTitle>
              <CardDescription>
                Isi informasi untuk membuat kelas pembelajaran baru.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Nama Kelas <Badge variant="destructive" className="text-[10px] ml-1 px-1.5 py-0">Wajib</Badge>
              </label>
              <Input
                id="name"
                placeholder="contoh: Python Dasar - Kelas A"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={submitting}
                className="bg-white"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Deskripsi <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <textarea
                id="description"
                placeholder="Deskripsi singkat tentang kelas ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={submitting}
                rows={3}
                className="flex w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>

            {/* Feedback */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
                  feedback.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {feedback.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0" />
                )}
                {feedback.message}
              </motion.div>
            )}

            {/* Submit */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={submitting || !name.trim()}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Membuat...
                  </>
                ) : (
                  "Buat Kelas"
                )}
              </Button>
              <Link href="/teacher/classrooms">
                <Button type="button" variant="outline" disabled={submitting}>
                  Batal
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
