"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CreditCard, Wallet, Landmark } from "lucide-react";

export default function PaymentStep() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/checkout/review");
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-pebble">
        <CreditCard className="w-6 h-6 text-terracotta" />
        <h2 className="text-[24px] font-display text-bark">Payment Method</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
            {/* UPI Option */}
            <label className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === "upi" ? "border-sage bg-sage/5" : "border-pebble bg-white hover:border-stone"}`}>
               <div className="pt-1">
                 <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="upi" 
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4 text-sage border-stone focus:ring-sage focus:ring-offset-1"
                 />
               </div>
               <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                        <Wallet className="w-5 h-5 text-charcoal" />
                        <span className="font-semibold text-charcoal">UPI Apps</span>
                   </div>
                   <p className="text-[13px] text-stone">Pay using GPay, PhonePe, Paytm, etc.</p>
               </div>
            </label>

            {/* Card Option */}
            <label className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === "card" ? "border-sage bg-sage/5" : "border-pebble bg-white hover:border-stone"}`}>
               <div className="pt-1">
                 <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="card" 
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4 text-sage border-stone focus:ring-sage focus:ring-offset-1"
                 />
               </div>
               <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-5 h-5 text-charcoal" />
                        <span className="font-semibold text-charcoal">Credit / Debit Card</span>
                   </div>
                   <p className="text-[13px] text-stone">Visa, Mastercard, RuPay, and more.</p>
               </div>
            </label>

            {/* COD Option */}
            <label className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-sage bg-sage/5" : "border-pebble bg-white hover:border-stone"}`}>
               <div className="pt-1">
                 <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="cod" 
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-4 h-4 text-sage border-stone focus:ring-sage focus:ring-offset-1"
                 />
               </div>
               <div className="flex-1">
                   <div className="flex items-center gap-2 mb-1">
                        <Landmark className="w-5 h-5 text-charcoal" />
                        <span className="font-semibold text-charcoal">Cash on Delivery</span>
                   </div>
                   <p className="text-[13px] text-stone">Pay with cash when your order arrives.</p>
               </div>
            </label>
        </div>

        <div className="pt-8 flex justify-between items-center border-t border-pebble">
           <button 
                type="button" 
                onClick={() => router.push("/checkout/delivery")}
                className="text-[14px] font-medium text-stone hover:text-charcoal transition-colors"
            >
               Back to Delivery
           </button>
           <button type="submit" className="btn-primary py-4 px-8 flex justify-center items-center gap-2">
               Review Order <ArrowRight className="w-4 h-4" />
           </button>
        </div>
      </form>
    </div>
  );
}
