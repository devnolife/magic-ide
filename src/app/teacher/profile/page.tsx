"use client";

import ProfileForm from "@/components/profile/ProfileForm";

export default function TeacherProfilePage() {
  return (
    <div className="mx-auto max-w-2xl py-6">
      <h1 className="mb-6 text-2xl font-bold text-emerald-700 dark:text-emerald-400">
        Profil Guru
      </h1>
      <ProfileForm theme="emerald" />
    </div>
  );
}
