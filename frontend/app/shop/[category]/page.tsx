"use client";

import { useState } from "react";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SortDropdown, type SortOption } from "@/components/search/SortDropdown";
import { SlidersHorizontal } from "lucide-react";
import { use } from "react";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.category;
  
  const [sort, setSort] = useState<SortOption>("popular");
  
  // Find category ID from slug
  const { data: categories } = useCategories();
  const currentCategory = categories?.find(c => c.slug === categorySlug);

  const { data, isLoading } = useProducts({
    limit: 24,
    category: currentCategory?.id,
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-display text-bark mb-2 capitalize">
            {currentCategory?.name || categorySlug.replace("-", " ")}
          </h1>
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
