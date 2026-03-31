"use client";

import ProfileForm from "@/components/profile/ProfileForm";

export default function DashboardProfilePage() {
  return (
    <div className="mx-auto max-w-2xl py-6">
      <h1 className="mb-6 text-2xl font-bold">Profil Saya</h1>
      <ProfileForm theme="neutral" />
    </div>
  );
}
