"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp, fadeUpTransition } from "@/lib/animations";
import type { Category } from "@/types/product";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  // Take top 6 categories for the home page
  const displayCategories = categories.slice(0, 6);

  return (
    <section className="py-20 bg-cream">
      <div className="container-store">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-40px" }}
            transition={fadeUpTransition}
          >
            <h2 className="section-title mb-2">Shop by Category</h2>
            <p className="text-body text-stone">Find exactly what you need for your home.</p>
          </motion.div>
          
          <motion.div
             variants={fadeUp}
             initial="initial"
             whileInView="animate"
             viewport={{ once: true, margin: "-40px" }}
             transition={{...fadeUpTransition, delay: 0.1}}
          >
              <Link href="/shop" className="group flex items-center gap-1.5 text-[14px] font-medium text-bark hover:text-cedar transition-colors">
                View all categories
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ...fadeUpTransition, delay: index * 0.05 }}
            >
              <Link
                href={`/shop/${category.slug}`}
                className="group block text-center"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-pebble mb-4 shadow-card transition-shadow duration-300 group-hover:shadow-hover">
                   <Image
                      src={category.imageUrl || "/placeholder-category.jpg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                    {/* Subtle warm overlay on hover */}
                    <div className="absolute inset-0 bg-bark/0 transition-colors duration-300 group-hover:bg-bark/10" />
                </div>
                <h3 className="font-sans font-medium text-[15px] text-charcoal group-hover:text-bark transition-colors">
                  {category.name}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
