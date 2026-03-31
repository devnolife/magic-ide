"use client";

import ProfileForm from "@/components/profile/ProfileForm";
import ChangePasswordSection from "@/components/profile/ChangePasswordSection";
import ProgressResetSection from "@/components/profile/ProgressResetSection";

export default function DashboardProfilePage() {
  return (
    <div className="mx-auto max-w-2xl py-6">
      <h1 className="mb-6 text-2xl font-bold">Profil Saya</h1>
      <ProfileForm theme="neutral" />
      <div className="mt-6">
        <ChangePasswordSection />
      </div>
      <div className="mt-6">
        <ProgressResetSection />
      </div>
    </div>
  );
}
