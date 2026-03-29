"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  Download,
  Lock,
  CheckCircle,
  Loader2,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";

interface CertificateData {
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  totalLessons: number;
  completedLessons: number;
  isCompleted: boolean;
  completedAt: string | null;
  totalPoints: number;
  timeSpent: number;
}

function CertificateCanvas({
  cert,
  userName,
}: {
  cert: CertificateData;
  userName: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCertificate = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, "#1e1b4b");
    grad.addColorStop(0.5, "#312e81");
    grad.addColorStop(1, "#1e1b4b");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Border
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 4;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    // Inner border
    ctx.strokeStyle = "#7c3aed";
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    // Corner decorations
    const corners = [
      [40, 40],
      [w - 40, 40],
      [40, h - 40],
      [w - 40, h - 40],
    ];
    corners.forEach(([x, y]) => {
      ctx.fillStyle = "#a78bfa";
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
    });

    // Star icon at top
    ctx.fillStyle = "#fbbf24";
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.fillText("⭐", w / 2, 90);

    // Title
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "bold 16px sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("SERTIFIKAT PENYELESAIAN", w / 2, 130);

    // Chapter title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(cert.chapterTitle, w / 2, 175);

    // Subtitle
    ctx.fillStyle = "#a5b4fc";
    ctx.font = "14px sans-serif";
    ctx.fillText(`Chapter ${cert.chapterNumber} — Python Learning Hub`, w / 2, 205);

    // Divider
    ctx.strokeStyle = "#6d28d9";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 100, 225);
    ctx.lineTo(w / 2 + 100, 225);
    ctx.stroke();

    // "Diberikan kepada"
    ctx.fillStyle = "#a5b4fc";
    ctx.font = "14px sans-serif";
    ctx.fillText("Diberikan kepada", w / 2, 260);

    // User name
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(userName, w / 2, 300);

    // Completion info
    ctx.fillStyle = "#c4b5fd";
    ctx.font = "13px sans-serif";
    ctx.fillText(
      `Telah menyelesaikan ${cert.totalLessons} pelajaran dengan ${cert.totalPoints} poin`,
      w / 2,
      340
    );

    // Date
    const date = cert.completedAt
      ? new Date(cert.completedAt).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";
    ctx.fillStyle = "#818cf8";
    ctx.font = "12px sans-serif";
    ctx.fillText(`Diselesaikan pada: ${date}`, w / 2, 375);

    // Footer
    ctx.fillStyle = "#6366f1";
    ctx.font = "11px sans-serif";
    ctx.fillText("Python Learning Hub — Platform Pembelajaran Interaktif", w / 2, h - 50);
  }, [cert, userName]);

  useEffect(() => {
    if (canvasRef.current && cert.isCompleted) {
      drawCertificate(canvasRef.current);
    }
  }, [cert, userName, drawCertificate]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = `sertifikat-chapter-${cert.chapterNumber}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  if (!cert.isCompleted) return null;

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        width={700}
        height={420}
        className="w-full rounded-lg shadow-lg"
      />
      <Button onClick={handleDownload} size="sm" className="w-full">
        <Download className="w-4 h-4 mr-2" />
        Download Sertifikat
      </Button>
    </div>
  );
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [userName, setUserName] = useState("");
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/certificates", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCertificates(data.certificates);
          setUserName(data.userName);
          setTotalCompleted(data.totalCompleted);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="floating" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Award className="w-7 h-7 text-yellow-500" />
              Sertifikat Saya
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {totalCompleted > 0
                ? `${totalCompleted} sertifikat diperoleh — selamat!`
                : "Selesaikan chapter untuk mendapatkan sertifikat"}
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {certificates.map((cert, idx) => (
                <motion.div
                  key={cert.chapterId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card
                    className={
                      cert.isCompleted
                        ? "border-yellow-200/50"
                        : "opacity-60"
                    }
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          {cert.isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          )}
                          Chapter {cert.chapterNumber}
                        </CardTitle>
                        <Badge
                          variant={cert.isCompleted ? "default" : "secondary"}
                        >
                          {cert.isCompleted ? (
                            <>
                              <Star className="w-3 h-3 mr-1" />
                              Diperoleh
                            </>
                          ) : (
                            `${cert.completedLessons}/${cert.totalLessons}`
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {cert.chapterTitle}
                      </p>
                    </CardHeader>
                    <CardContent>
                      {cert.isCompleted ? (
                        <CertificateCanvas cert={cert} userName={userName} />
                      ) : (
                        <div className="flex flex-col items-center py-8 text-center text-muted-foreground">
                          <Lock className="w-10 h-10 mb-3 opacity-30" />
                          <p className="text-sm">
                            Selesaikan semua {cert.totalLessons} pelajaran
                          </p>
                          <p className="text-xs mt-1">
                            {cert.completedLessons}/{cert.totalLessons} selesai
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
