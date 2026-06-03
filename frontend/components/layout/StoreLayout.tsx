"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CartDrawer } from "../cart/CartDrawer";

interface StoreLayoutProps {
  children: React.ReactNode;
}

export function StoreLayout({ children }: StoreLayoutProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isAuth = pathname?.startsWith("/auth");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      {!isAuth && <Navbar />}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      {!isAuth && <Footer />}
      <CartDrawer />
    </>
  );
}
