"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { ProductImage } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageGalleryProps {
  images: ProductImage[];
  altPrefix: string;
}

export function ProductImageGallery({ images, altPrefix }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const displayImages = images?.length > 0 ? images : [{ url: "/placeholder-product.jpg", alt: altPrefix, position: 1 }];

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-pebble border border-stone/10 shadow-card">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={displayImages[currentIndex].url}
              alt={displayImages[currentIndex].alt || altPrefix}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {displayImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-charcoal shadow-sm hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-charcoal shadow-sm hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5 -mr-0.5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {displayImages.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                currentIndex === idx ? "border-terracotta" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt || `${altPrefix} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
