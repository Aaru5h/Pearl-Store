"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) {
  const starSize = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  const textSize = {
    sm: "text-[12px]",
    md: "text-[13px]",
    lg: "text-[15px]",
  }[size];

  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starNumber = i + 1;
        const isFilled = starNumber <= Math.floor(rating);
        const isHalf = !isFilled && starNumber <= rating + 0.5 && starNumber > rating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange?.(starNumber)}
            className={cn(
              "transition-colors",
              interactive
                ? "cursor-pointer hover:scale-110"
                : "cursor-default"
            )}
            aria-label={
              interactive ? `Rate ${starNumber} stars` : `${starNumber} star`
            }
          >
            <Star
              className={cn(
                starSize,
                "transition-colors",
                isFilled
                  ? "fill-amber-400 text-amber-400"
                  : isHalf
                  ? "fill-amber-400/50 text-amber-400"
                  : "fill-transparent text-dust"
              )}
            />
          </button>
        );
      })}
      {showValue && (
        <span className={cn("font-sans font-medium text-charcoal ml-1", textSize)}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
