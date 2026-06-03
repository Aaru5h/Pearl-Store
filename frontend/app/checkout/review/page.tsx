"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { CheckCircle2, Loader2, Edit3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ReviewStep() {
  const router = useRouter();
  const { items, subtotal, total, discount, clear } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deliveryFee = total() > 50000 ? 0 : 5000; // Rs. 50 delivery fee if under Rs. 500
  const finalTotal = total() + deliveryFee;

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clear();
    setIsSubmitting(false);
    router.push("/checkout/success");
  };

  if (items.length === 0 && !isSubmitting) {
    router.push("/shop");
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-pebble">
        <CheckCircle2 className="w-6 h-6 text-terracotta" />
        <h2 className="text-[24px] font-display text-bark">Review Your Order</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
            {/* Delivery Details Summary */}
            <div className="bg-cream/50 rounded-xl p-6 border border-pebble relative">
                <Link href="/checkout/delivery" className="absolute top-6 right-6 text-stone hover:text-bark">
                    <Edit3 className="w-4 h-4" />
                </Link>
                <h3 className="font-sans font-semibold text-[16px] text-charcoal mb-4 uppercase tracking-wider">Delivery Details</h3>
                <div className="text-[14px] text-charcoal leading-relaxed">
                    <p className="font-medium">John Doe</p>
                    <p>Flat 402, Pearl Residency</p>
                    <p>MG Road, Bangalore, Karnataka - 560001</p>
                    <p className="mt-2 text-stone">+91 98765 43210</p>
                </div>
            </div>

            {/* Payment Method Summary */}
            <div className="bg-cream/50 rounded-xl p-6 border border-pebble relative">
                <Link href="/checkout/payment" className="absolute top-6 right-6 text-stone hover:text-bark">
                    <Edit3 className="w-4 h-4" />
                </Link>
                <h3 className="font-sans font-semibold text-[16px] text-charcoal mb-4 uppercase tracking-wider">Payment Method</h3>
                <p className="text-[14px] font-medium text-charcoal">UPI App</p>
            </div>

            {/* Items Summary */}
            <div>
                 <h3 className="font-sans font-semibold text-[16px] text-charcoal mb-4 uppercase tracking-wider">Order Items</h3>
                 <ul className="divide-y divide-pebble border-t border-b border-pebble">
                    {items.map((item) => (
                        <li key={item.id} className="py-4 flex gap-4 items-center">
                             <div className="relative w-16 h-16 rounded-md bg-linen overflow-hidden flex-shrink-0">
                                <Image src={item.productImage || "/placeholder-product.jpg"} alt={item.productName || "Product"} fill className="object-cover" />
                             </div>
                             <div className="flex-1">
                                 <p className="text-[14px] font-medium text-charcoal line-clamp-1">{item.productName}</p>
                                 <p className="text-[13px] text-stone">Qty: {item.quantity}</p>
                             </div>
                             <PriceDisplay amount={item.total} size="sm" />
                        </li>
                    ))}
                 </ul>
            </div>
        </div>

        {/* Final Summary */}
        <div className="lg:col-span-5">
           <div className="bg-linen rounded-xl p-6 border border-pebble sticky top-24">
               <h3 className="font-sans font-semibold text-[16px] text-charcoal mb-6 uppercase tracking-wider">Price Details</h3>
               
               <div className="space-y-4 mb-6 text-[14px]">
                  <div className="flex justify-between text-charcoal">
                    <span>Subtotal ({items.length} items)</span>
                    <PriceDisplay amount={subtotal()} size="sm" />
                  </div>
                  {discount() > 0 && (
                    <div className="flex justify-between text-sage">
                      <span>Discount</span>
                      <span>-<PriceDisplay amount={discount()} size="sm" /></span>
                    </div>
                  )}
                  <div className="flex justify-between text-charcoal">
                    <span>Delivery Fee</span>
                    {deliveryFee === 0 ? (
                        <span className="text-sage font-medium">Free</span>
                    ) : (
                        <PriceDisplay amount={deliveryFee} size="sm" />
                    )}
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-pebble border-dashed flex justify-between items-center">
                    <span className="text-[18px] font-semibold text-bark">Total Amount</span>
                    <PriceDisplay amount={finalTotal} size="lg" />
                  </div>
                </div>

                <button 
                   onClick={handlePlaceOrder}
                   disabled={isSubmitting}
                   className="btn-primary w-full py-4 text-[16px] flex justify-center items-center gap-2"
                >
                   {isSubmitting ? (
                       <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                   ) : (
                       "Place Order & Pay"
                   )}
                </button>
                <p className="text-center text-[12px] text-stone mt-4 leading-relaxed">
                    By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
           </div>
        </div>
      </div>
    </div>
  );
}
