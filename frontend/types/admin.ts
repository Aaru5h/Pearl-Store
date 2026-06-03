export interface AdminStats {
  ordersToday: number;
  revenueToday: number;
  activeDeliveries: number;
  lowStockCount: number;
  newUsersToday: number;
  pendingRefunds: number;
  failedDeliveries: number;
  outOfStockCount: number;
}

export interface InventoryHealth {
  normal: number;
  lowStock: number;
  outOfStock: number;
  full: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface ProductAnalytics {
  productId: string;
  productName: string;
  productImage: string | null;
  revenue: number;
  quantitySold: number;
  orderCount: number;
}

export interface CustomerAnalytics {
  userId: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface AuditLogEntry {
  id: string;
  actorId: string | null;
  actorName: string | null;
  actorRole: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  oldValue: unknown;
  newValue: unknown;
  ipAddress: string | null;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING" | "BUY_X_GET_Y";
  value: number;
  minOrderAmount: number;
  maxDiscountCap: number | null;
  maxUsesTotal: number | null;
  maxUsesPerUser: number;
  usesCount: number;
  applicableTo: "ALL" | "CATEGORY" | "PRODUCT";
  applicableIds: string[];
  validFrom: string | null;
  validUntil: string | null;
  isActive: boolean;
  createdAt: string;
}
