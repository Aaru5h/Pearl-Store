"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 10,
  disabled = false,
  size = "md",
  className,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min) onQuantityChange(quantity - 1);
  };

  const handleIncrement = () => {
    if (quantity < max) onQuantityChange(quantity + 1);
  };

  return (
    <div
      className={cn(
        "inline-flex items-center border border-pebble rounded-md",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || quantity <= min}
        className={cn(
          "flex items-center justify-center text-stone transition-colors hover:text-bark hover:bg-fog disabled:opacity-30 disabled:hover:bg-transparent",
          size === "sm" ? "w-7 h-7" : "w-9 h-9"
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      </button>
      <span
        className={cn(
          "font-sans font-medium text-charcoal text-center select-none border-x border-pebble",
          size === "sm" ? "w-8 h-7 text-[13px] leading-7" : "w-10 h-9 text-[14px] leading-9"
        )}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        className={cn(
          "flex items-center justify-center text-stone transition-colors hover:text-bark hover:bg-fog disabled:opacity-30 disabled:hover:bg-transparent",
          size === "sm" ? "w-7 h-7" : "w-9 h-9"
        )}
        aria-label="Increase quantity"
      >
        <Plus className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      </button>
    </div>
  );
}
