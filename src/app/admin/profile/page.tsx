"use client";

import ProfileForm from "@/components/profile/ProfileForm";

export default function AdminProfilePage() {
  return (
    <div className="mx-auto max-w-2xl py-6">
      <h1 className="mb-6 text-2xl font-bold text-blue-700 dark:text-blue-400">
        Profil Administrator
      </h1>
      <ProfileForm theme="blue" />
    </div>
  );
}
