"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { fadeUp, fadeUpTransition } from "@/lib/animations";
import type { Product } from "@/types/product";

interface FeaturedSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  isLoading?: boolean;
}

export function FeaturedSection({
  title,
  subtitle,
  products,
  viewAllLink = "/shop",
  isLoading = false,
}: FeaturedSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container-store">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
          >
            <h2 className="section-title mb-2">{title}</h2>
            {subtitle && <p className="text-body text-stone">{subtitle}</p>}
          </motion.div>
          
          {viewAllLink && (
             <motion.div
               variants={fadeUp}
               initial="initial"
               whileInView="animate"
               viewport={{ once: true, margin: "-40px" }}
               transition={{...fadeUpTransition, delay: 0.1}}
            >
                <Link href={viewAllLink} className="group flex items-center gap-1.5 text-[14px] font-medium text-bark hover:text-cedar transition-colors">
                  View all
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </motion.div>
          )}
        </div>

        <ProductGrid products={products.slice(0, 4)} isLoading={isLoading} skeletonCount={4} columns={4} />
      </div>
    </section>
  );
}
