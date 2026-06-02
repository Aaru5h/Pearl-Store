import { Order } from '../../../domain/commerce/Order';
import { OrderStatus } from '@prisma/client';

export interface OrderQueryFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  paymentStatus?: string;
  deliveryType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  sortBy?: string;
}

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByOrderNumber(orderNumber: string): Promise<Order | null>;
  findManyByUserId(userId: string, page: number, limit: number, status?: OrderStatus): Promise<{ items: Order[]; total: number }>;
  findMany(filters: OrderQueryFilters): Promise<{ items: Order[]; total: number }>;
  save(order: Order): Promise<Order>;
  generateNextOrderNumber(): Promise<string>;
}
