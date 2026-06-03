"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  Store
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // In a real app, middleware handles this.
    // Ensure the user is an admin or owner.
    if (!isAuthenticated || (user?.role !== "ADMIN" && user?.role !== "OWNER")) {
      // router.push("/auth/login"); // Uncomment when auth is properly mocked/working
    }
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex text-charcoal font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
            className="fixed inset-0 bg-charcoal/40 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
         className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-pebble flex flex-col transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
         }`}
      >
         <div className="p-6 border-b border-pebble flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2 text-bark font-display text-[20px]">
                <Store className="w-5 h-5" /> Pearl Admin
            </Link>
            <button className="lg:hidden text-stone" onClick={() => setIsSidebarOpen(false)}>
                <X className="w-5 h-5" />
            </button>
         </div>

         <nav className="flex-1 overflow-y-auto p-4 space-y-1">
             {NAV_ITEMS.map((item) => {
                 const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
                 const Icon = item.icon;
                 return (
                     <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-[14px] font-medium ${
                            isActive 
                              ? "bg-linen text-bark" 
                              : "text-stone hover:bg-cream hover:text-charcoal"
                        }`}
                     >
                         <Icon className="w-5 h-5" />
                         {item.label}
                     </Link>
                 );
             })}
         </nav>

         <div className="p-4 border-t border-pebble">
             <div className="flex items-center gap-3 mb-4 px-2">
                 <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-bark font-bold text-[14px]">
                     {user?.name?.charAt(0) || "A"}
                 </div>
                 <div className="flex-1 overflow-hidden">
                     <p className="text-[14px] font-semibold text-charcoal truncate">{user?.name || "Admin User"}</p>
                     <p className="text-[12px] text-stone truncate">{user?.role || "ADMIN"}</p>
                 </div>
             </div>
             <button 
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-error hover:bg-error/10 rounded-lg text-[14px] font-medium transition-colors"
            >
                 <LogOut className="w-4 h-4" /> Sign Out
             </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
          {/* Top Header */}
          <header className="h-16 bg-white border-b border-pebble flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
              <div className="flex items-center gap-4">
                  <button className="lg:hidden text-stone hover:text-charcoal" onClick={() => setIsSidebarOpen(true)}>
                      <Menu className="w-6 h-6" />
                  </button>
                  <h1 className="font-semibold text-charcoal hidden sm:block">
                      {NAV_ITEMS.find(i => pathname === i.href || (i.href !== "/admin" && pathname?.startsWith(i.href)))?.label || "Dashboard"}
                  </h1>
              </div>
              
              <div className="flex items-center gap-4">
                  <Link href="/" target="_blank" className="text-[13px] font-medium text-stone hover:text-bark transition-colors hidden sm:block">
                      View Storefront
                  </Link>
              </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 p-4 md:p-8 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                  {children}
              </div>
          </div>
      </main>
    </div>
  );
}
