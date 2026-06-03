"use client";

import { useCategories } from "@/hooks/useProducts";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface FilterSidebarProps {
  currentCategorySlug?: string;
  className?: string;
}

export function FilterSidebar({ currentCategorySlug, className = "" }: FilterSidebarProps) {
  const { data: categories, isLoading } = useCategories();
  const pathname = usePathname();

  return (
    <aside className={`w-full md:w-[240px] flex-shrink-0 ${className}`}>
      <div className="sticky top-24">
        <h3 className="font-sans font-semibold text-[16px] text-charcoal mb-4 uppercase tracking-wider">
          Categories
        </h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-5 bg-pebble animate-pulse rounded w-3/4" />
            ))}
          </div>
        ) : (
          <ul className="space-y-1.5">
            <li>
              <Link
                href="/shop"
                className={`block py-1.5 px-2 -mx-2 rounded-md transition-colors text-[14px] ${
                  pathname === "/shop" 
                    ? "bg-linen text-bark font-medium" 
                    : "text-stone hover:bg-cream hover:text-charcoal"
                }`}
              >
                All Products
              </Link>
            </li>
            {categories?.map((category) => {
              const isActive = currentCategorySlug === category.slug;
              return (
                <li key={category.id}>
                  <Link
                    href={`/shop/${category.slug}`}
                    className={`block py-1.5 px-2 -mx-2 rounded-md transition-colors text-[14px] ${
                      isActive 
                        ? "bg-linen text-bark font-medium" 
                        : "text-stone hover:bg-cream hover:text-charcoal"
                    }`}
                  >
                    {category.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-10">
           <h3 className="font-sans font-semibold text-[16px] text-charcoal mb-4 uppercase tracking-wider">
            Price Range
          </h3>
          <p className="text-[13px] text-stone mb-4">Price filtering coming soon.</p>
        </div>
      </div>
    </aside>
  );
}
