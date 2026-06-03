"use client";

import { FilterSidebar } from "@/components/search/FilterSidebar";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-cream min-h-screen pt-10 pb-20">
      <div className="container-store">
        {/* Page Header can go here if needed, or inside children */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative items-start">
          <FilterSidebar className="hidden md:block" />
          <div className="flex-1 w-full">{children}</div>
        </div>
      </div>
    </div>
  );
}
