export type Role = "CUSTOMER" | "ADMIN" | "OWNER";

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
  role: Role;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string | null;
  recipientName: string;
  recipientPhone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
  lat: number | null;
  lng: number | null;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: "order" | "delivery" | "restock" | "payment" | "system";
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}
