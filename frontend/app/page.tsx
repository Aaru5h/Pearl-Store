"use client";

import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { OffersBanner } from "@/components/home/OffersBanner";
import { TestimonialsStrip } from "@/components/home/TestimonialsStrip";
import { useCategories, useFeaturedProducts, useNewArrivals } from "@/hooks/useProducts";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: featuredProducts, isLoading: isLoadingFeatured } = useFeaturedProducts();
  const { data: newArrivals, isLoading: isLoadingNew } = useNewArrivals();

  return (
    <div className="flex flex-col w-full">
      <HeroBanner />
      
      {/* Categories */}
      {isLoadingCategories ? (
         <div className="py-20 flex justify-center bg-cream"><Loader2 className="w-8 h-8 animate-spin text-terracotta" /></div>
      ) : (
        <CategoryGrid categories={categories || []} />
      )}

      {/* Featured Products */}
      <FeaturedSection 
        title="Handpicked for You" 
        subtitle="Discover our selection of premium, locally sourced products."
        products={featuredProducts || []} 
        isLoading={isLoadingFeatured}
      />

      <OffersBanner />

      {/* New Arrivals / Best Sellers */}
      <FeaturedSection 
        title="Fresh Arrivals" 
        products={newArrivals || []} 
        isLoading={isLoadingNew}
        viewAllLink="/shop?sort=newest"
      />

      <TestimonialsStrip />
    </div>
  );
}
