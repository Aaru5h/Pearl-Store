"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { StarRating } from "@/components/shared/StarRating";
import { cn } from "@/lib/utils";
import { fadeUp, fadeUpTransition } from "@/lib/animations";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  index?: number;
  className?: string;
}

export function ProductCard({ product, index = 0, className }: ProductCardProps) {
  const primaryImage =
    product.images?.[0]?.url || "/placeholder-product.jpg";
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const isOutOfStock =
    product.inventory && product.inventory.quantityAvailable <= 0;

  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.basePrice - product.salePrice!) / product.basePrice) * 100
      )
    : 0;

  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...fadeUpTransition, delay: index * 0.06 }}
      className={cn("card-product group relative", className)}
    >
      {/* Image Container */}
      <Link
        href={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-linen"
      >
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="badge-sale">{discountPercentage}% off</span>
          )}
          {product.isFeatured && <span className="badge-featured">Featured</span>}
          {isOutOfStock && <span className="badge-oos">Out of stock</span>}
        </div>

        {/* Hover Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <button
            type="button"
            className="w-8 h-8 bg-cream/90 backdrop-blur-sm rounded-full flex items-center justify-center text-stone hover:text-bark hover:bg-cream transition-colors shadow-card"
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="w-4 h-4" />
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="w-8 h-8 bg-cream/90 backdrop-blur-sm rounded-full flex items-center justify-center text-stone hover:text-bark hover:bg-cream transition-colors shadow-card"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Quick Add to Cart (bottom) */}
        {!isOutOfStock && (
          <div className="absolute bottom-0 left-0 right-0 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
            <button
              type="button"
              className="w-full py-2.5 bg-bark/90 backdrop-blur-sm text-cream text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-bark transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Add to cart
              }}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-3.5">
        {product.brand && (
          <p className="text-[11px] font-medium text-stone uppercase tracking-[0.04em] mb-1">
            {product.brand}
          </p>
        )}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-[14px] font-medium text-charcoal leading-snug line-clamp-2 hover:text-bark transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <PriceDisplay
            amount={product.salePrice ?? product.basePrice}
            originalAmount={hasDiscount ? product.basePrice : undefined}
            size="sm"
          />
        </div>
        {product.unit && product.unit !== "piece" && (
          <p className="text-[11px] text-dust mt-0.5">per {product.unit}</p>
        )}
      </div>
    </motion.div>
  );
}
