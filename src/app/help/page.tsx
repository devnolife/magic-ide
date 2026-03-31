"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  BookOpen,
  LayoutDashboard,
  User,
  ArrowLeft,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const faqItems = [
  {
    question: "Bagaimana cara memulai belajar?",
    answer:
      "Buka dashboard, pilih chapter yang tersedia, mulai dari Chapter 0 - Pengenalan Pemrograman.",
  },
  {
    question: "Bagaimana cara mengerjakan tantangan?",
    answer:
      'Di setiap chapter ada tantangan yang harus diselesaikan. Klik tombol "Tantangan" di halaman chapter.',
  },
  {
    question: "Apa itu kode aktivasi?",
    answer:
      "Kode aktivasi diberikan oleh guru/admin untuk mengaktifkan akun guru. Siswa tidak memerlukan kode aktivasi.",
  },
  {
    question: "Bagaimana jika saya lupa password?",
    answer:
      "Hubungi guru Anda untuk mereset password. Guru dapat mereset password di halaman kelas.",
  },
  {
    question: "Bagaimana cara melihat progress saya?",
    answer:
      "Buka dashboard untuk melihat progress keseluruhan. Setiap chapter menunjukkan persentase penyelesaian.",
  },
  {
    question: "Bagaimana cara mengikuti ujian?",
    answer:
      "Guru akan membuat sesi ujian. Cek dashboard untuk melihat ujian yang aktif.",
  },
];

const quickLinks = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Lihat ringkasan belajar dan progress Anda",
    icon: LayoutDashboard,
    color: "from-emerald-400 to-emerald-600",
  },
  {
    href: "/chapter/0",
    label: "Materi Chapter 0",
    description: "Mulai dari Pengenalan Pemrograman",
    icon: BookOpen,
    color: "from-blue-400 to-blue-600",
  },
  {
    href: "/dashboard/profile",
    label: "Profil",
    description: "Kelola akun dan pengaturan Anda",
    icon: User,
    color: "from-purple-400 to-purple-600",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <Card
      className="border border-white/60 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onToggle}
    >
      <CardContent className="p-4 md:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-medium text-gray-800 text-sm md:text-base">
              {question}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        <div
          className={`overflow-hidden transition-all duration-200 ${
            isOpen ? "max-h-40 mt-3" : "max-h-0"
          }`}
        >
          <Separator className="mb-3" />
          <p className="text-gray-600 text-sm leading-relaxed pl-11">
            {answer}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            variant="outline"
            asChild
            className="mb-6 border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-full"
          >
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-4 text-sm px-4 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Pusat Informasi
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Pusat Bantuan
            </span>
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto text-base md:text-lg">
            Temukan jawaban dari pertanyaan yang sering diajukan seputar
            platform belajar Python.
          </p>
        </motion.div>

        {/* FAQ Section */}
        <motion.section
          className="mb-12 md:mb-16"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            Pertanyaan yang Sering Diajukan
          </h2>
          <div className="space-y-3">
            {faqItems.map((item, index) => (
              <motion.div key={index} variants={fadeUp}>
                <FAQItem
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === index}
                  onToggle={() => handleToggle(index)}
                />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Links */}
        <motion.section
          className="mb-12 md:mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            Tautan Cepat
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <Card className="border border-white/60 bg-white/70 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 h-full">
                    <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-md`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {link.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {link.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border border-purple-200/60 bg-gradient-to-r from-purple-50 to-blue-50 shadow-sm">
            <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-1">
                  Butuh Bantuan Lebih?
                </h3>
                <p className="text-gray-600 text-sm">
                  Hubungi guru Anda untuk bantuan lebih lanjut. Guru dapat
                  membantu mereset password, mengaktifkan akun, dan menjawab
                  pertanyaan seputar materi.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
