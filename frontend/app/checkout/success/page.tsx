"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition } from "@/lib/animations";

export default function SuccessStep() {
  // In a real app, we'd fetch the order details using the ID from searchParams or similar
  const orderId = "ORD-P" + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-20 px-4 text-center">
      <motion.div
         initial={{ scale: 0.8, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         transition={{ type: "spring", stiffness: 200, damping: 20 }}
         className="mb-8 relative"
      >
        <div className="absolute inset-0 bg-sage blur-2xl opacity-20 rounded-full" />
        <CheckCircle2 className="w-24 h-24 text-sage relative z-10" />
      </motion.div>

      <motion.div
        variants={fadeUp}
        initial="initial"
        animate="animate"
        transition={fadeUpTransition}
        className="max-w-md w-full"
      >
        <h1 className="text-display text-bark mb-4">Order Confirmed!</h1>
        <p className="text-body text-charcoal/80 mb-8">
          Thank you for shopping with Pearl Store. Your order has been placed successfully and is being processed.
        </p>

        <div className="bg-white border border-pebble rounded-xl p-6 mb-8 text-left shadow-sm">
            <p className="text-[13px] text-stone uppercase tracking-wider font-semibold mb-1">Order Number</p>
            <p className="font-mono text-[16px] text-bark font-medium mb-4">{orderId}</p>
            
            <p className="text-[13px] text-stone uppercase tracking-wider font-semibold mb-1">Estimated Delivery</p>
            <p className="text-[15px] text-charcoal font-medium">Tomorrow, between 9 AM - 12 PM</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-secondary py-3 flex justify-center">
                Continue Shopping
            </Link>
            <Link href="/" className="btn-primary py-3 flex justify-center items-center gap-2">
                Track Order <ArrowRight className="w-4 h-4" />
            </Link>
        </div>
      </motion.div>
    </div>
  );
}
