"use client";

import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { slideLeft, slideLeftTransition } from "@/lib/animations";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeDrawer,
    subtotal,
    total,
    discount,
    updateQuantity,
    removeItem,
  } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-50"
            onClick={closeDrawer}
          />
          <motion.div
            variants={slideLeft}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={slideLeftTransition}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-cream z-50 shadow-modal flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-pebble">
              <h2 className="font-sans text-[20px] font-medium text-charcoal flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Your Cart
              </h2>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-1.5 text-stone hover:text-bark rounded-full hover:bg-linen transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-stone">
                  <ShoppingBag className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-[15px] font-medium text-charcoal mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-[14px]">Looks like you haven't added anything yet.</p>
                  <button
                    onClick={closeDrawer}
                    className="mt-6 btn-secondary"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg bg-linen overflow-hidden flex-shrink-0 border border-pebble">
                      <Image
                        src={item.productImage || "/placeholder-product.jpg"}
                        alt={item.productName || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <Link
                          href={`/product/${item.productSlug}`}
                          onClick={closeDrawer}
                          className="text-[14px] font-medium text-charcoal hover:text-bark line-clamp-2"
                        >
                          {item.productName}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-stone hover:text-error p-1 -mr-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {item.variantName && (
                        <p className="text-[12px] text-stone mb-2">
                          {item.variantName}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-pebble rounded-md bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 text-stone hover:text-bark"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-[13px] font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-stone hover:text-bark"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <PriceDisplay amount={item.total} size="sm" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-pebble bg-white">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[14px] text-stone">
                    <span>Subtotal</span>
                    <PriceDisplay amount={subtotal()} size="sm" />
                  </div>
                  {discount() > 0 && (
                    <div className="flex justify-between text-[14px] text-sage">
                      <span>Discount</span>
                      <span>-<PriceDisplay amount={discount()} size="sm" /></span>
                    </div>
                  )}
                  <div className="flex justify-between text-[16px] font-medium text-charcoal pt-3 border-t border-pebble border-dashed">
                    <span>Total</span>
                    <PriceDisplay amount={total()} size="md" />
                  </div>
                </div>
                <Link
                  href="/checkout/delivery"
                  onClick={closeDrawer}
                  className="btn-primary w-full text-center flex justify-center py-3"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="block w-full text-center text-[13px] text-stone hover:text-bark mt-4 font-medium"
                >
                  View full cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
