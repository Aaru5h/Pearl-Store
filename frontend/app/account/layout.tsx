"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { User, Package, MapPin, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { label: "Profile Details", href: "/account", icon: User },
  { label: "Order History", href: "/account/orders", icon: Package },
  { label: "Saved Addresses", href: "/account/addresses", icon: MapPin },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // In a real app with middleware this might be redundant, but good for client-side protection
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) return null;

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-cream py-10 md:py-20">
      <div className="container-store">
        <h1 className="text-display text-bark mb-10 text-[32px] md:text-[40px]">My Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Sidebar */}
          <aside className="md:col-span-3 lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-pebble sticky top-24">
              <div className="mb-6 pb-6 border-b border-pebble">
                <p className="font-semibold text-charcoal text-[18px]">
                  {user.name}
                </p>
                <p className="text-[14px] text-stone truncate">{user.email}</p>
              </div>

              <nav className="space-y-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? "bg-linen text-bark font-medium"
                          : "text-stone hover:bg-cream hover:text-charcoal"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-[14px]">{item.label}</span>
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-xl text-error hover:bg-error/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-[14px] font-medium">Log out</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-9 lg:col-span-9">
            <div className="bg-white rounded-2xl p-6 md:p-10 shadow-card border border-pebble">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
