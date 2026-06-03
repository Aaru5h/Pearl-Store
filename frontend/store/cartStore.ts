import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, AppliedCoupon } from "@/types/cart";

interface CartStore {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  isOpen: boolean; // cart drawer state

  // Computed
  itemCount: () => number;
  subtotal: () => number;
  discount: () => number;
  total: () => number;

  // Actions
  addItem: (item: Omit<CartItem, "id" | "total" | "addedAt"> & { id?: string }) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  flagItemUnavailable: (itemId: string) => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setItems: (items: CartItem[]) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isOpen: false,

      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      subtotal: () =>
        get().items.reduce(
          (sum, item) => sum + item.priceSnapshot * item.quantity,
          0
        ),

      discount: () => get().coupon?.discount ?? 0,

      total: () => Math.max(0, get().subtotal() - get().discount()),

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find(
            (item) =>
              item.productId === newItem.productId &&
              item.variantId === newItem.variantId
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === existing.id
                  ? {
                      ...item,
                      quantity: item.quantity + newItem.quantity,
                      total:
                        item.priceSnapshot * (item.quantity + newItem.quantity),
                    }
                  : item
              ),
            };
          }

          const id = newItem.id || `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          return {
            items: [
              ...state.items,
              {
                ...newItem,
                id,
                total: newItem.priceSnapshot * newItem.quantity,
                addedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  quantity,
                  total: item.priceSnapshot * quantity,
                }
              : item
          ),
        }));
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      flagItemUnavailable: (itemId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, isUnavailable: true } : item
          ),
        }));
      },

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      openDrawer: () => set({ isOpen: true }),
      closeDrawer: () => set({ isOpen: false }),

      setItems: (items) => set({ items }),
      clear: () => set({ items: [], coupon: null }),
    }),
    {
      name: "pearl-cart",
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
    }
  )
);
