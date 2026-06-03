export type DeliveryStatus =
  | "PENDING_ASSIGNMENT"
  | "ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "ARRIVED_AT_DOOR"
  | "DELIVERED"
  | "FAILED_ATTEMPT"
  | "RETURNED";

export type ChecklistStatus = "DRAFT" | "PUBLISHED" | "IN_PROGRESS" | "COMPLETED";
export type ChecklistItemStatus = "PENDING" | "COMPLETED" | "FAILED" | "SKIPPED";

export interface DeliveryStatusHistoryEntry {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  changedBy: string | null;
  note: string | null;
  lat: number | null;
  lng: number | null;
  createdAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  orderNumber: string;
  assignedTo: string | null;
  agentName: string | null;
  status: DeliveryStatus;
  trackingNumber: string;
  estimatedDeliveryDate: string | null;
  estimatedArrivalTime: string | null;
  actualDeliveryAt: string | null;
  deliveryProofUrl: string | null;
  failureReason: string | null;
  attemptCount: number;
  gpsLat: number | null;
  gpsLng: number | null;
  history: DeliveryStatusHistoryEntry[];
  customerName?: string;
  customerPhone?: string;
  deliveryArea?: string;
  address?: string;
  items?: { name: string; quantity: number }[];
}

export interface DeliverySlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  bookedCount: number;
  areaCode: string | null;
  isActive: boolean;
  status: "available" | "filling_up" | "full";
}

export interface DeliveryChecklist {
  id: string;
  date: string;
  assignedTo: string | null;
  agentName: string | null;
  title: string;
  status: ChecklistStatus;
  totalOrders: number;
  delivered: number;
  failed: number;
  notes: string | null;
  createdBy: string | null;
  items: DeliveryChecklistItem[];
}

export interface DeliveryChecklistItem {
  id: string;
  checklistId: string;
  deliveryId: string;
  sequenceNumber: number;
  status: ChecklistItemStatus;
  completedAt: string | null;
  notes: string | null;
  delivery?: Delivery;
}

export const DELIVERY_STEPS = [
  { key: "PENDING_ASSIGNMENT", label: "Order Placed" },
  { key: "ASSIGNED", label: "Confirmed" },
  { key: "OUT_FOR_DELIVERY", label: "Being Packed" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "ARRIVED_AT_DOOR", label: "Arrived at your door" },
  { key: "DELIVERED", label: "Delivered" },
] as const;
