"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp, fadeUpTransition, staggerContainer } from "@/lib/animations";

export function HeroBanner() {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-linen overflow-hidden pt-16 md:pt-20">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none">
        <Image
          src="/placeholder-texture.jpg" // We'll need a real texture image here or use CSS noise
          alt="Linen texture"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container-store relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="max-w-xl"
          >
            <motion.p
              variants={fadeUp}
              transition={fadeUpTransition}
              className="text-stone uppercase tracking-[0.08em] text-[13px] font-semibold mb-4"
            >
              Your Neighbourhood Store, Online
            </motion.p>
            <motion.h1
              variants={fadeUp}
              transition={fadeUpTransition}
              className="text-display text-bark mb-6"
            >
              Everything you need, delivered with care.
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={fadeUpTransition}
              className="text-body-lg text-charcoal/80 mb-10 max-w-md"
            >
              Fresh groceries, daily essentials, and handcrafted local goods.
              Experience the warmth of your local shop from the comfort of your home.
            </motion.p>
            <motion.div
              variants={fadeUp}
              transition={fadeUpTransition}
              className="flex flex-wrap items-center gap-4"
            >
              <Link href="/shop" className="btn-primary flex items-center gap-2">
                Shop Essentials
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/offers" className="btn-secondary">
                View Today's Offers
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image Group */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ ...fadeUpTransition, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full"
          >
            {/* Main Image */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[85%] h-[90%] rounded-2xl overflow-hidden shadow-modal border-4 border-white/40">
              <Image
                src="/placeholder-hero-main.jpg"
                alt="Fresh produce and groceries"
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Floating Element 1 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 bottom-[15%] w-48 h-56 rounded-xl overflow-hidden shadow-hover border-4 border-white"
            >
               <Image
                src="/placeholder-hero-small1.jpg"
                alt="Fresh bread"
                fill
                className="object-cover"
              />
            </motion.div>
            
             {/* Floating Badge */}
             <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[10%] right-[10%] bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl shadow-card flex items-center gap-3 border border-pebble"
             >
                <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center text-sage">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <div>
                    <p className="text-[12px] text-stone font-medium leading-none mb-1">Delivering to</p>
                    <p className="text-[14px] font-semibold text-bark leading-none">Your Doorstep</p>
                </div>
             </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
