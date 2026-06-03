"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { QuantitySelector } from "@/components/shared/QuantitySelector";
import { StarRating } from "@/components/shared/StarRating";
import type { ProductDetail } from "@/types/product";
import { ShieldCheck, Truck, RotateCcw } from "lucide-react";

interface ProductInfoProps {
  productDetail: ProductDetail;
}

export function ProductInfo({ productDetail }: ProductInfoProps) {
  const { product, reviewSummary, inventory } = productDetail;
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const isOutOfStock = inventory.quantityAvailable <= 0 && !inventory.allowBackorder;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      variantId: null,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.images?.[0]?.url,
      priceSnapshot: product.salePrice || product.basePrice,
      quantity: quantity,
    });
  };

  return (
    <div className="flex flex-col">
      {/* Brand & Title */}
      <div className="mb-2">
        {product.brand && (
          <p className="text-[13px] font-semibold tracking-wider uppercase text-stone mb-1">
            {product.brand}
          </p>
        )}
        <h1 className="text-display text-bark text-[32px] md:text-[40px] leading-tight">
          {product.name}
        </h1>
      </div>

      {/* Reviews & Badges */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <StarRating rating={reviewSummary.averageRating} size="sm" />
          <span className="text-[14px] text-stone">
            ({reviewSummary.totalReviews} reviews)
          </span>
        </div>
        {product.isFeatured && (
          <span className="px-2 py-0.5 bg-sage/10 text-sage text-[12px] font-medium rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mb-8">
        <PriceDisplay 
            amount={product.salePrice || product.basePrice} 
            originalAmount={product.salePrice ? product.basePrice : undefined}
            size="lg" 
        />
        <p className="text-[13px] text-stone mt-1">Inclusive of all taxes</p>
      </div>

      {/* Short Description */}
      {product.shortDescription && (
        <p className="text-body text-charcoal/80 mb-8 pb-8 border-b border-pebble">
          {product.shortDescription}
        </p>
      )}

      {/* Add to Cart Actions */}
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-1/3 max-w-[140px]">
            <span className="block text-[13px] font-medium text-stone mb-2">Quantity</span>
            <QuantitySelector 
                quantity={quantity} 
                onQuantityChange={setQuantity} 
                max={inventory.quantityAvailable || 10} 
            />
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="btn-primary w-full py-4 text-[16px] mt-2"
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-t border-pebble">
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-terracotta">
                <Truck className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[14px] font-medium text-bark">Fast Delivery</p>
                <p className="text-[12px] text-stone">Within 24 hours</p>
             </div>
         </div>
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-sage">
                <ShieldCheck className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[14px] font-medium text-bark">Quality Assured</p>
                <p className="text-[12px] text-stone">Handpicked items</p>
             </div>
         </div>
         <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center text-stone">
                <RotateCcw className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[14px] font-medium text-bark">Easy Returns</p>
                <p className="text-[12px] text-stone">No questions asked</p>
             </div>
         </div>
      </div>

      {/* Full Description & Attributes */}
      <div className="mt-10 pt-10 border-t border-pebble">
        <h3 className="font-sans font-semibold text-[18px] text-charcoal mb-4">Product Details</h3>
        <p className="text-body text-charcoal/80 mb-6 leading-relaxed whitespace-pre-wrap">
            {product.description}
        </p>

        {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="bg-cream rounded-xl p-6">
                <ul className="space-y-3">
                    {Object.entries(product.attributes).map(([key, value]) => (
                        <li key={key} className="flex items-start gap-4 text-[14px]">
                            <span className="font-medium text-stone w-1/3">{key}</span>
                            <span className="text-charcoal flex-1">{value as string}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}
      </div>
    </div>
  );
}
