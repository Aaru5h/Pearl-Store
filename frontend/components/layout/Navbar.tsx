"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { scaleUp, scaleUpTransition, slideRight, slideRightTransition } from "@/lib/animations";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/offers", label: "Offers" },
  { href: "/shop?sort=newest", label: "New Arrivals" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const cartItemCount = useCartStore((s) => s.itemCount());
  const openDrawer = useCartStore((s) => s.openDrawer);
  const { isAuthenticated, user } = useAuthStore();
  const { isMobileMenuOpen, openMobileMenu, closeMobileMenu } = useUIStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-cream/95 backdrop-blur-md shadow-card border-b border-pebble/50"
            : "bg-transparent"
        )}
      >
        <div className="container-store">
          <nav className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Left: Hamburger (mobile) + Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="md:hidden p-1.5 -ml-1.5 text-charcoal hover:text-bark transition-colors"
                onClick={isMobileMenuOpen ? closeMobileMenu : openMobileMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              <Link
                href="/"
                className="font-display text-[20px] md:text-[22px] font-medium text-bark tracking-[-0.02em] hover:text-cedar transition-colors"
              >
                Pearl Store
              </Link>
            </div>

            {/* Center: Nav Links (desktop) */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-[14px] font-medium text-stone hover:text-bark transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-bark transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </div>

            {/* Right: Search + Wishlist + Cart + Account */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search */}
              <AnimatePresence>
                {searchOpen ? (
                  <motion.form
                    initial={{ width: 40, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 40, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    onSubmit={handleSearchSubmit}
                    className="relative hidden md:flex"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full h-9 pl-9 pr-8 text-[13px] bg-linen border border-pebble rounded-full focus:outline-none focus:border-bark/40 focus:ring-1 focus:ring-bark/10 text-charcoal placeholder:text-dust"
                      autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone hover:text-bark"
                      aria-label="Close search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className="hidden md:flex items-center justify-center w-9 h-9 text-stone hover:text-bark transition-colors rounded-full hover:bg-linen"
                    aria-label="Search"
                  >
                    <Search className="w-[18px] h-[18px]" />
                  </button>
                )}
              </AnimatePresence>

              {/* Mobile search */}
              <Link
                href="/search"
                className="md:hidden flex items-center justify-center w-9 h-9 text-stone hover:text-bark transition-colors"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </Link>

              {/* Wishlist (desktop) */}
              <Link
                href="/account/wishlist"
                className="hidden md:flex items-center justify-center w-9 h-9 text-stone hover:text-bark transition-colors rounded-full hover:bg-linen"
                aria-label="Wishlist"
              >
                <Heart className="w-[18px] h-[18px]" />
              </Link>

              {/* Cart */}
              <button
                type="button"
                onClick={openDrawer}
                className="relative flex items-center justify-center w-9 h-9 text-stone hover:text-bark transition-colors rounded-full hover:bg-linen"
                aria-label={`Cart with ${cartItemCount} items`}
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-bark text-cream text-[10px] font-semibold rounded-full flex items-center justify-center leading-none">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </button>

              {/* Account */}
              <div className="relative">
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                      className="flex items-center gap-1 px-2 py-1.5 text-stone hover:text-bark transition-colors rounded-full hover:bg-linen"
                      aria-label="Account menu"
                    >
                      <div className="w-7 h-7 bg-linen border border-pebble rounded-full flex items-center justify-center text-[12px] font-semibold text-bark">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <ChevronDown className="hidden md:block w-3.5 h-3.5" />
                    </button>
                    <AnimatePresence>
                      {accountMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setAccountMenuOpen(false)}
                          />
                          <motion.div
                            variants={scaleUp}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={scaleUpTransition}
                            className="absolute right-0 top-full mt-2 w-52 bg-cream border border-pebble rounded-xl shadow-hover py-2 z-50"
                          >
                            <div className="px-4 py-2 border-b border-pebble mb-1">
                              <p className="text-[13px] font-medium text-charcoal truncate">
                                {user?.name}
                              </p>
                              <p className="text-[12px] text-stone truncate">
                                {user?.email}
                              </p>
                            </div>
                            {[
                              { href: "/account", label: "My Account" },
                              { href: "/account/orders", label: "Orders" },
                              { href: "/account/wishlist", label: "Wishlist" },
                              { href: "/account/addresses", label: "Addresses" },
                            ].map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setAccountMenuOpen(false)}
                                className="block px-4 py-2 text-[13px] text-stone hover:text-bark hover:bg-linen transition-colors"
                              >
                                {item.label}
                              </Link>
                            ))}
                            <div className="border-t border-pebble mt-1 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setAccountMenuOpen(false);
                                  useAuthStore.getState().clearAuth();
                                  window.location.href = "/";
                                }}
                                className="w-full text-left px-4 py-2 text-[13px] text-error hover:bg-[#F5EDED] transition-colors"
                              >
                                Sign out
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center w-9 h-9 text-stone hover:text-bark transition-colors rounded-full hover:bg-linen"
                    aria-label="Sign in"
                  >
                    <User className="w-[18px] h-[18px]" />
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              variants={slideRight}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={slideRightTransition}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-cream z-50 md:hidden shadow-modal"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <Link
                    href="/"
                    className="font-display text-[20px] font-medium text-bark"
                    onClick={closeMobileMenu}
                  >
                    Pearl Store
                  </Link>
                  <button
                    type="button"
                    onClick={closeMobileMenu}
                    className="p-1 text-stone hover:text-bark"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1">
                  {[
                    { href: "/", label: "Home" },
                    ...NAV_LINKS,
                    { href: "/account/wishlist", label: "Wishlist" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="block py-3 text-[16px] font-medium text-charcoal hover:text-bark transition-colors border-b border-pebble/50"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-8">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <Link
                        href="/account"
                        onClick={closeMobileMenu}
                        className="block py-3 text-[15px] text-stone hover:text-bark"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={closeMobileMenu}
                        className="block py-3 text-[15px] text-stone hover:text-bark"
                      >
                        Orders
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href="/auth/login"
                      onClick={closeMobileMenu}
                      className="btn-primary block text-center"
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
