"use client";

import { use } from "react";
import { useProductDetail } from "@/hooks/useProducts";
import { ProductImageGallery } from "@/components/product/ProductImageGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const { data: productDetail, isLoading, error } = useProductDetail(resolvedParams.slug);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta mb-4" />
        <p className="text-stone">Loading product details...</p>
      </div>
    );
  }

  if (error || !productDetail) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <p className="text-display text-charcoal mb-4">Product Not Found</p>
        <p className="text-stone mb-8">We couldn't find the product you're looking for.</p>
        <Link href="/shop" className="btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Breadcrumbs (simplified) */}
      <div className="border-b border-pebble bg-cream/50">
          <div className="container-store py-4">
              <nav className="flex items-center text-[13px] text-stone">
                  <Link href="/" className="hover:text-bark transition-colors">Home</Link>
                  <span className="mx-2">/</span>
                  <Link href="/shop" className="hover:text-bark transition-colors">Shop</Link>
                  <span className="mx-2">/</span>
                  {productDetail.breadcrumbs?.[0] && (
                     <>
                        <Link href={`/shop/${productDetail.breadcrumbs[0].slug}`} className="hover:text-bark transition-colors capitalize">
                            {productDetail.breadcrumbs[0].name}
                        </Link>
                        <span className="mx-2">/</span>
                     </>
                  )}
                  <span className="text-charcoal font-medium truncate max-w-[200px]">{productDetail.product.name}</span>
              </nav>
          </div>
      </div>

      <div className="container-store py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="lg:sticky lg:top-24 h-max">
            <ProductImageGallery 
                images={productDetail.product.images || []} 
                altPrefix={productDetail.product.name} 
            />
          </div>
          <div>
            <ProductInfo productDetail={productDetail} />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {productDetail.relatedProducts && productDetail.relatedProducts.length > 0 && (
        <section className="bg-cream py-20 border-t border-pebble">
           <div className="container-store">
              <h2 className="section-title mb-10 text-center">You might also like</h2>
              <ProductGrid 
                  products={productDetail.relatedProducts} 
                  isLoading={false} 
                  columns={4} 
              />
           </div>
        </section>
      )}
    </div>
  );
}
