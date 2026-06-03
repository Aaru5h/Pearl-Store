"use client";

import { ProductCard } from "./ProductCard";
import { ProductCardSkeleton } from "./ProductCardSkeleton";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  skeletonCount?: number;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ProductGrid({
  products,
  isLoading = false,
  skeletonCount = 8,
  columns = 4,
  className,
}: ProductGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  }[columns];

  if (isLoading) {
    return (
      <div className={cn("grid gap-4 md:gap-5", gridCols, className)}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 md:gap-5", gridCols, className)}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
