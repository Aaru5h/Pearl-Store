import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "./components/CustomCursor";

export const metadata: Metadata = {
  title: "PEARL — Curated Premium Store",
  description: "Discover intentionally crafted objects that transform your space. Premium quality, timeless design.",
  keywords: ["store", "premium", "luxury", "home", "lifestyle", "pearl"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="noise-overlay" aria-hidden="true" />
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
