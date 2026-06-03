"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Left side - Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 lg:p-24 relative z-10">
        <div className="w-full max-w-md">
            <Link href="/" className="inline-flex items-center gap-2 text-stone hover:text-charcoal transition-colors mb-12">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-[14px] font-medium">Back to Store</span>
            </Link>
            
            {children}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:block w-1/2 relative bg-terracotta">
        <div className="absolute inset-0 bg-charcoal/20 mix-blend-multiply z-10" />
        <Image
          src="/placeholder-auth-bg.jpg" // Replace with actual image
          alt="Pearl Store aesthetic"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center p-12 text-white text-center">
            <h2 className="font-display text-[40px] lg:text-[48px] leading-tight mb-6">
                Welcome to <br/> Pearl Store
            </h2>
            <p className="text-[16px] text-white/90 max-w-sm leading-relaxed">
                Your neighbourhood general store, reimagined for the modern home. 
                Fresh, local, and delivered with care.
            </p>
        </div>
      </div>
    </div>
  );
}
