import type { Metadata } from "next";
import { Lora, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pearl Store — Everything you need, delivered with care",
    template: "%s | Pearl Store",
  },
  description:
    "Your neighbourhood general store, online. Fresh groceries, household essentials, and everyday items delivered to your doorstep with care.",
  keywords: [
    "general store",
    "groceries",
    "online store",
    "delivery",
    "Pearl Store",
    "household essentials",
  ],
  openGraph: {
    title: "Pearl Store — Everything you need, delivered with care",
    description:
      "Your neighbourhood general store, online. Fresh groceries, household essentials, and everyday items.",
    siteName: "Pearl Store",
    type: "website",
  },
};

import { StoreLayout } from "@/components/layout/StoreLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${lora.variable} ${dmSans.variable}`}>
      <body className="bg-cream text-charcoal font-sans antialiased flex flex-col min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="noise-overlay" aria-hidden="true" />
        <Providers>
          <StoreLayout>{children}</StoreLayout>
        </Providers>
      </body>
    </html>
  );
}
