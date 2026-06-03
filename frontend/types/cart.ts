export interface CartItem {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  priceSnapshot: number; // paise
  total: number; // paise
  addedAt: string;
  // Enriched client-side fields
  productName?: string;
  productImage?: string;
  productSlug?: string;
  productBrand?: string;
  productUnit?: string;
  variantName?: string;
  quantityAvailable?: number;
  isUnavailable?: boolean;
}

export interface Cart {
  id: string;
  userId: string | null;
  sessionToken: string | null;
  couponCode: string | null;
  couponDiscount: number; // paise
  subtotal: number; // paise
  total: number; // paise
  items: CartItem[];
}

export interface AppliedCoupon {
  code: string;
  discount: number; // paise
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  description: string;
}
