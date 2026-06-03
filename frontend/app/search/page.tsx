"use client";

import { useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Search as SearchIcon } from "lucide-react";
import { Suspense } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";

  const { data, isLoading } = useProducts({
    limit: 24,
    search: query,
  });

  return (
    <div className="bg-cream min-h-screen pt-10 pb-20">
      <div className="container-store">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-pebble">
            <SearchIcon className="w-6 h-6 text-stone" />
          </div>
          <h1 className="text-display text-bark mb-4">
            {query ? `Search results for "${query}"` : "Search our store"}
          </h1>
          {query && (
             <p className="text-body text-stone">
               {isLoading ? "Searching..." : `Found ${data?.items.length || 0} products matching your criteria.`}
            </p>
          )}
        </div>

        {query ? (
            <ProductGrid 
                products={data?.items || []} 
                isLoading={isLoading} 
                skeletonCount={8} 
                columns={4} 
            />
        ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-pebble">
                <p className="text-stone">Enter a search term in the navigation bar to find products.</p>
            </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <SearchContent />
    </Suspense>
  );
}
