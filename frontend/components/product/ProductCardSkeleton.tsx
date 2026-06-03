"use client";

import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  className?: string;
}

export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("bg-white border border-pebble rounded-lg overflow-hidden", className)}>
      <div className="aspect-square skeleton" />
      <div className="p-3.5 space-y-2.5">
        <div className="h-3 skeleton w-16" />
        <div className="h-4 skeleton w-full" />
        <div className="h-4 skeleton w-3/4" />
        <div className="h-5 skeleton w-20 mt-1" />
      </div>
    </div>
  );
}
