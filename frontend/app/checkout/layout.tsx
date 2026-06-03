"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, Check } from "lucide-react";

const STEPS = [
  { id: "delivery", label: "Delivery", path: "/checkout/delivery" },
  { id: "payment", label: "Payment", path: "/checkout/payment" },
  { id: "review", label: "Review", path: "/checkout/review" },
];

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Find current step index
  const currentStepIndex = STEPS.findIndex((step) => pathname?.includes(step.path));

  // Determine if it's the success page
  const isSuccess = pathname?.includes("/checkout/success");

  if (isSuccess) {
    return <div className="min-h-screen bg-cream">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Checkout Header (Simplified Navbar) */}
      <header className="bg-white border-b border-pebble py-6">
        <div className="container-store flex items-center justify-between">
          <Link href="/cart" className="font-display text-[24px] text-bark hover:text-terracotta transition-colors">
            Pearl Store
          </Link>
          <Link href="/cart" className="text-[14px] text-stone hover:text-charcoal font-medium">
            Return to Cart
          </Link>
        </div>
      </header>

      <div className="flex-1 container-store py-10 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-pebble -z-10" />
              <div 
                 className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-sage -z-10 transition-all duration-500" 
                 style={{ width: `${(Math.max(0, currentStepIndex) / (STEPS.length - 1)) * 100}%` }}
              />
              
              {STEPS.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step.id} className="flex flex-col items-center gap-2">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors ${
                        isCompleted ? "bg-sage text-white" : 
                        isCurrent ? "bg-bark text-white ring-4 ring-bark/20" : 
                        "bg-white border border-pebble text-stone"
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                    </div>
                    <span className={`text-[13px] font-medium ${isCurrent ? "text-bark" : "text-stone"}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white rounded-3xl shadow-card border border-pebble p-6 md:p-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
