"use client";

import { useCartStore } from "@/store/cartStore";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { QuantitySelector } from "@/components/shared/QuantitySelector";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { fadeUp, fadeUpTransition } from "@/lib/animations";

export default function CartPage() {
  const { items, subtotal, total, discount, updateQuantity, removeItem } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="bg-cream min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-pebble">
          <ShoppingBag className="w-10 h-10 text-stone opacity-50" />
        </div>
        <h1 className="text-display text-bark mb-4">Your Cart is Empty</h1>
        <p className="text-body text-stone mb-8 max-w-md text-center">
          Looks like you haven't added anything to your cart yet. Let's find some great products for you.
        </p>
        <Link href="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-12 md:py-20">
      <div className="container-store">
        <h1 className="text-display text-bark mb-10">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-card border border-pebble overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-pebble bg-cream/30 text-[13px] font-semibold text-stone uppercase tracking-wider">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-3 text-right">Total</div>
              </div>

              <ul className="divide-y divide-pebble">
                {items.map((item, index) => (
                  <motion.li 
                    key={item.id}
                    variants={fadeUp}
                    initial="initial"
                    animate="animate"
                    transition={{ ...fadeUpTransition, delay: index * 0.05 }}
                    className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
                  >
                    {/* Product Info */}
                    <div className="md:col-span-6 flex gap-4 items-center">
                      <Link href={`/product/${item.productSlug}`} className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl bg-linen border border-pebble overflow-hidden flex-shrink-0">
                        <Image
                          src={item.productImage || "/placeholder-product.jpg"}
                          alt={item.productName || "Product image"}
                          fill
                          className="object-cover"
                        />
                      </Link>
                      <div>
                        <Link href={`/product/${item.productSlug}`} className="font-medium text-[16px] text-charcoal hover:text-bark transition-colors line-clamp-2 mb-1">
                          {item.productName}
                        </Link>
                        {item.variantName && (
                          <p className="text-[13px] text-stone mb-2">{item.variantName}</p>
                        )}
                        <div className="md:hidden mt-2">
                           <PriceDisplay amount={item.priceSnapshot} size="sm" />
                        </div>
                        <button 
                            onClick={() => removeItem(item.id)}
                            className="text-[13px] text-stone hover:text-error transition-colors flex items-center gap-1 mt-2"
                        >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-3 flex justify-between md:justify-center items-center">
                      <span className="md:hidden text-[13px] font-medium text-stone">Quantity</span>
                      <QuantitySelector 
                        quantity={item.quantity} 
                        onQuantityChange={(q) => updateQuantity(item.id, q)} 
                      />
                    </div>

                    {/* Total */}
                    <div className="md:col-span-3 flex justify-between md:justify-end items-center">
                       <span className="md:hidden text-[13px] font-medium text-stone">Total</span>
                       <PriceDisplay amount={item.total} size="md" />
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
             <div className="bg-white rounded-2xl shadow-card border border-pebble p-6 lg:sticky lg:top-24">
                <h2 className="font-sans font-semibold text-[18px] text-charcoal mb-6 pb-4 border-b border-pebble">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[15px] text-charcoal">
                    <span>Subtotal</span>
                    <PriceDisplay amount={subtotal()} size="sm" />
                  </div>
                  {discount() > 0 && (
                    <div className="flex justify-between text-[15px] text-sage">
                      <span>Discount</span>
                      <span>-<PriceDisplay amount={discount()} size="sm" /></span>
                    </div>
                  )}
                  <div className="flex justify-between text-[15px] text-charcoal">
                    <span>Delivery</span>
                    <span className="text-stone">Calculated at next step</span>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-pebble border-dashed flex justify-between items-end">
                    <div>
                        <p className="text-[18px] font-semibold text-charcoal">Total</p>
                        <p className="text-[12px] text-stone">Inclusive of all taxes</p>
                    </div>
                    <PriceDisplay amount={total()} size="lg" />
                  </div>
                </div>

                <Link href="/checkout/delivery" className="btn-primary w-full text-center flex justify-center py-4 mb-4">
                  Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                
                <div className="bg-cream p-4 rounded-xl flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0 text-sage">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <p className="text-[12px] text-stone leading-relaxed">
                        Your order is eligible for free delivery if the total exceeds <PriceDisplay amount={50000} size="sm" className="inline" />.
                    </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
