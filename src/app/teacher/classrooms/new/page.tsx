"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
      className="space-y-6"
    >
      {/* Back link */}
      <Link
        href="/teacher/classrooms"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Daftar Kelas
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white">
          <School className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Buat Kelas Baru</h1>
          <p className="text-sm text-muted-foreground">
            Isi informasi untuk membuat kelas pembelajaran baru.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium text-foreground"
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
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-foreground"
          >
            Deskripsi <span className="text-muted-foreground font-normal">(opsional)</span>
          </label>
          <textarea
            id="description"
            placeholder="Deskripsi singkat tentang kelas ini..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={submitting}
            rows={3}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
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
    </motion.div>
  );
}
