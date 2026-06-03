"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { fadeUp, fadeUpTransition } from "@/lib/animations";

export function OffersBanner() {
  return (
    <section className="py-12 bg-cream">
      <div className="container-store">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-40px" }}
          transition={fadeUpTransition}
          className="relative rounded-2xl overflow-hidden bg-terracotta text-cream shadow-card flex flex-col md:flex-row"
        >
          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[12px] font-semibold uppercase tracking-wider mb-6 w-max">
              Limited Time Offer
            </span>
            <h2 className="font-display text-[32px] md:text-[40px] leading-tight mb-4 text-white">
              Get 20% off your first grocery order.
            </h2>
            <p className="text-white/80 text-[15px] mb-8 max-w-sm">
              Use code <strong className="text-white">WELCOME20</strong> at checkout.
              Valid on fresh produce, pantry staples, and more.
            </p>
            
            <div className="flex flex-wrap items-center gap-6">
                <Link href="/shop" className="bg-white text-terracotta font-medium px-6 py-3 rounded-lg hover:bg-cream transition-colors flex items-center gap-2">
                    Shop Now
                    <ArrowRight className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-2 text-white/80 text-[13px]">
                    <Clock className="w-4 h-4" />
                    <span>Ends in 2 days</span>
                </div>
            </div>
          </div>

          {/* Decorative Pattern / Image */}
          <div className="relative h-64 md:h-auto md:w-1/2">
             <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-terracotta z-10" />
             <Image
                src="/placeholder-offer-bg.jpg" // We need a suitable background image here
                alt="Fresh groceries"
                fill
                className="object-cover"
             />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
