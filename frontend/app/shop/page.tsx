"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SortDropdown, type SortOption } from "@/components/search/SortDropdown";
import { SlidersHorizontal } from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialSort = (searchParams?.get("sort") as SortOption) || "popular";
  const [sort, setSort] = useState<SortOption>(initialSort);

  // We fetch products. Since we use mock data, filtering/sorting isn't fully implemented in the hook yet,
  // but we set up the structure.
  const { data, isLoading } = useProducts({
    limit: 24,
    // Add sorting in real implementation
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-display text-bark mb-2">All Products</h1>
          <p className="text-body text-stone">
             {isLoading ? "Loading products..." : `Showing ${data?.items.length || 0} products`}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="md:hidden flex items-center justify-center gap-2 px-4 py-2 border border-pebble bg-white rounded-md text-[14px] font-medium text-charcoal w-full">
             <SlidersHorizontal className="w-4 h-4" />
             Filters
          </button>
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </div>

      <ProductGrid 
        products={data?.items || []} 
        isLoading={isLoading} 
        skeletonCount={12} 
        columns={3} 
      />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}
