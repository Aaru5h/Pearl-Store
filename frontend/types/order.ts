export type OrderStatus =
  | "DRAFT"
  | "PENDING_PAYMENT"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUND_REQUESTED"
  | "REFUNDED";

export type PaymentStatus =
  | "UNPAID"
  | "PAID"
  | "PARTIALLY_REFUNDED"
  | "FULLY_REFUNDED";

export type PaymentMethod = "STRIPE" | "CASH_ON_DELIVERY" | "WALLET";

export type DeliveryType = "HOME_DELIVERY" | "STORE_PICKUP";

export interface OrderItem {
  id: string;
  productId: string | null;
  variantId: string | null;
  productName: string;
  productSku: string;
  productImage: string | null;
  unit: string;
  quantity: number;
  unitPrice: number; // paise
  taxRate: number;
  taxAmount: number; // paise
  totalPrice: number; // paise
}

export interface OrderStatusHistoryEntry {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  changedBy: string | null;
  note: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number; // paise
  discountAmount: number;
  couponCode: string | null;
  taxAmount: number;
  shippingCost: number;
  total: number; // paise
  currency: string;
  shippingAddress: Record<string, string>;
  billingAddress: Record<string, string>;
  deliveryType: DeliveryType;
  deliverySlotId: string | null;
  requestedDeliveryDate: string | null;
  notes: string | null;
  items: OrderItem[];
  statusHistory?: OrderStatusHistoryEntry[];
  createdAt: string;
  confirmedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
}
