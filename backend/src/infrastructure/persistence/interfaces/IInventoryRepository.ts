import { InventoryEntry } from '../../../domain/inventory/InventoryEntry';
import { TransactionType } from '@prisma/client';

export interface InventoryTransactionDTO {
  productId: string;
  type: TransactionType;
  quantityChange: number;
  quantityBefore: number;
  quantityAfter: number;
  referenceType?: string;
  referenceId?: string;
  note?: string;
  performedBy?: string;
}

export interface IInventoryRepository {
  findByProductId(productId: string): Promise<InventoryEntry | null>;
  save(entry: InventoryEntry): Promise<InventoryEntry>;
  recordTransaction(dto: InventoryTransactionDTO): Promise<void>;
  findTransactionHistory(productId: string, page: number, limit: number): Promise<{ items: any[]; total: number }>;
}
