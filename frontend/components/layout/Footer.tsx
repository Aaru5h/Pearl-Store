import Link from "next/link";
import { Mail } from "lucide-react";

const SHOP_LINKS = [
  { href: "/shop", label: "All Products" },
  { href: "/offers", label: "Offers & Deals" },
  { href: "/shop?sort=newest", label: "New Arrivals" },
  { href: "/shop?sort=popular", label: "Best Sellers" },
];

const ACCOUNT_LINKS = [
  { href: "/account", label: "My Account" },
  { href: "/account/orders", label: "Order History" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/track", label: "Track Delivery" },
];

const HELP_LINKS = [
  { href: "#", label: "Contact Us" },
  { href: "#", label: "FAQs" },
  { href: "#", label: "Shipping Info" },
  { href: "#", label: "Return Policy" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-cream/90 mt-20">
      <div className="container-store py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="font-display text-[22px] font-medium text-cream tracking-[-0.02em]"
            >
              Pearl Store
            </Link>
            <p className="mt-3 text-[14px] text-cream/60 leading-relaxed max-w-[260px]">
              Everything you need, delivered with care. Your trusted neighbourhood
              store, now online.
            </p>
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-[12px] font-medium text-cream/50 uppercase tracking-[0.04em] mb-3">
                Stay updated
              </p>
              <form
                className="flex gap-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/30" />
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full h-10 pl-9 pr-3 bg-cream/8 border border-cream/10 rounded-lg text-[13px] text-cream placeholder:text-cream/30 focus:outline-none focus:border-cream/25 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="h-10 px-4 bg-cream text-charcoal text-[13px] font-medium rounded-lg hover:bg-cream/90 transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-[13px] font-semibold text-cream/50 uppercase tracking-[0.04em] mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-cream/70 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-[13px] font-semibold text-cream/50 uppercase tracking-[0.04em] mb-4">
              Account
            </h4>
            <ul className="space-y-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-cream/70 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-[13px] font-semibold text-cream/50 uppercase tracking-[0.04em] mb-4">
              Help
            </h4>
            <ul className="space-y-2.5">
              {HELP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] text-cream/70 hover:text-cream transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-cream/40">
            © {new Date().getFullYear()} Pearl Store. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-[12px] text-cream/40 hover:text-cream/70 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-[12px] text-cream/40 hover:text-cream/70 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
