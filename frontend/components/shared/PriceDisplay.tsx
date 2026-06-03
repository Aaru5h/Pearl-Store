"use client";

import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  amount: number; // in paise
  originalAmount?: number; // in paise, for showing sale price
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function PriceDisplay({
  amount,
  originalAmount,
  size = "md",
  className,
}: PriceDisplayProps) {
  const isSale = originalAmount && originalAmount > amount;

  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span
        className={cn("font-sans font-semibold text-bark", {
          "text-[14px]": size === "sm",
          "text-[18px] tracking-[-0.01em]": size === "md",
          "text-[24px] tracking-[-0.02em]": size === "lg",
        })}
      >
        {formatPrice(amount)}
      </span>
      {isSale && (
        <span
          className={cn("font-sans text-stone line-through", {
            "text-[12px]": size === "sm",
            "text-[14px]": size === "md",
            "text-[16px]": size === "lg",
          })}
        >
          {formatPrice(originalAmount)}
        </span>
      )}
    </span>
  );
}
