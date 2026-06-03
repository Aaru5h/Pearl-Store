"use client";

import { useAuthStore } from "@/store/authStore";

export default function AccountProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div>
      <h2 className="font-sans font-semibold text-[20px] text-charcoal mb-8 pb-4 border-b border-pebble">
        Profile Details
      </h2>

      <div className="max-w-xl space-y-6">
        <div className="space-y-2">
          <label className="block text-[13px] font-medium text-stone uppercase tracking-wider">
            Full Name
          </label>
          <p className="text-[16px] text-charcoal font-medium">{user.name}</p>
        </div>

        <div className="space-y-2">
          <label className="block text-[13px] font-medium text-stone uppercase tracking-wider">
            Email Address
          </label>
          <p className="text-[16px] text-charcoal font-medium">{user.email}</p>
        </div>

        <div className="pt-8">
            <button className="btn-secondary">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}
