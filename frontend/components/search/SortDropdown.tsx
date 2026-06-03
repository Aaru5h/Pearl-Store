"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Popularity", value: "popular" },
];

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = SORT_OPTIONS.find((opt) => opt.value === value) || SORT_OPTIONS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-4 py-2 border border-pebble bg-white rounded-md text-[14px] font-medium text-charcoal hover:border-stone transition-colors min-w-[180px]"
      >
        <span>Sort by: {selectedOption.label}</span>
        <ChevronDown className="w-4 h-4 text-stone" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-full bg-white border border-pebble rounded-md shadow-modal z-20 py-1 overflow-hidden">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                className="w-full text-left px-4 py-2 text-[14px] hover:bg-linen transition-colors flex items-center justify-between"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <span className={value === option.value ? "text-bark font-medium" : "text-charcoal"}>
                  {option.label}
                </span>
                {value === option.value && <Check className="w-4 h-4 text-sage" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
