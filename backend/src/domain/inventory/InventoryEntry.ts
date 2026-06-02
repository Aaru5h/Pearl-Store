import { ValidationError } from '../shared/errors/ValidationError';
import { InsufficientStockError } from '../shared/errors/InsufficientStockError';

export interface InventoryEntryProps {
  id?: string;
  productId: string;
  quantityOnHand?: number;
  quantityReserved?: number;
  lowStockThreshold?: number;
  reorderPoint?: number;
  maxCapacity?: string | number | null;
  allowBackorder?: boolean;
  backorderLimit?: number;
  lastCountedAt?: Date | null;
  updatedAt?: Date;
}

export class InventoryEntry {
  private readonly id?: string;
  private readonly productId: string;
  private quantityOnHand: number;
  private quantityReserved: number;
  private lowStockThreshold: number;
  private reorderPoint: number;
  private maxCapacity: number | null;
  private allowBackorder: boolean;
  private backorderLimit: number;
  private lastCountedAt: Date | null;
  private updatedAt: Date;

  constructor(props: InventoryEntryProps) {
    this.validate(props);
    this.id = props.id;
    this.productId = props.productId;
    this.quantityOnHand = props.quantityOnHand ?? 0;
    this.quantityReserved = props.quantityReserved ?? 0;
    this.lowStockThreshold = props.lowStockThreshold ?? 10;
    this.reorderPoint = props.reorderPoint ?? 5;
    this.maxCapacity = props.maxCapacity ? Number(props.maxCapacity) : null;
    this.allowBackorder = props.allowBackorder ?? false;
    this.backorderLimit = props.backorderLimit ?? 0;
    this.lastCountedAt = props.lastCountedAt ?? null;
    this.updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: InventoryEntryProps): void {
    if (!props.productId) {
      throw new ValidationError('Product ID is required for inventory entries');
    }
    if (props.quantityOnHand !== undefined && props.quantityOnHand < 0) {
      throw new ValidationError('Quantity on hand cannot be negative');
    }
    if (props.quantityReserved !== undefined && props.quantityReserved < 0) {
      throw new ValidationError('Quantity reserved cannot be negative');
    }
    if (props.lowStockThreshold !== undefined && props.lowStockThreshold < 0) {
      throw new ValidationError('Low stock threshold cannot be negative');
    }
    if (props.reorderPoint !== undefined && props.reorderPoint < 0) {
      throw new ValidationError('Reorder point cannot be negative');
    }
    if (props.backorderLimit !== undefined && props.backorderLimit < 0) {
      throw new ValidationError('Backorder limit cannot be negative');
    }
  }

  // Getters
  public getId(): string | undefined {
    return this.id;
  }

  public getProductId(): string {
    return this.productId;
  }

  public getQuantityOnHand(): number {
    return this.quantityOnHand;
  }

  public getQuantityReserved(): number {
    return this.quantityReserved;
  }

  public getLowStockThreshold(): number {
    return this.lowStockThreshold;
  }

  public getReorderPoint(): number {
    return this.reorderPoint;
  }

  public getMaxCapacity(): number | null {
    return this.maxCapacity;
  }

  public getAllowBackorder(): boolean {
    return this.allowBackorder;
  }

  public getBackorderLimit(): number {
    return this.backorderLimit;
  }

  public getLastCountedAt(): Date | null {
    return this.lastCountedAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Domain Actions
  public getQuantityAvailable(): number {
    return this.quantityOnHand - this.quantityReserved;
  }

  public isLowStock(): boolean {
    return this.getQuantityAvailable() <= this.lowStockThreshold;
  }

  public isFull(): boolean {
    if (this.maxCapacity === null) return false;
    return this.quantityOnHand >= this.maxCapacity;
  }

  public reserveStock(qty: number): void {
    if (qty <= 0) {
      throw new ValidationError('Reservation quantity must be greater than zero');
    }

    const available = this.getQuantityAvailable();
    if (qty > available) {
      if (!this.allowBackorder) {
        throw new InsufficientStockError(this.productId, qty, available);
      }
      
      const maxAllowedWithBackorder = available + this.backorderLimit;
      if (qty > maxAllowedWithBackorder) {
        throw new InsufficientStockError(
          this.productId,
          qty,
          available,
          `Insufficient stock including backorder limit. Requested: ${qty}, Max allowed: ${maxAllowedWithBackorder}`
        );
      }
    }

    this.quantityReserved += qty;
    this.updatedAt = new Date();
  }

  public releaseReservation(qty: number): void {
    if (qty <= 0) {
      throw new ValidationError('Release quantity must be greater than zero');
    }
    if (qty > this.quantityReserved) {
      throw new ValidationError(`Cannot release more than reserved. Reserved: ${this.quantityReserved}, Requested: ${qty}`);
    }

    this.quantityReserved -= qty;
    this.updatedAt = new Date();
  }

  public decrementStock(qty: number): void {
    if (qty <= 0) {
      throw new ValidationError('Decrement quantity must be greater than zero');
    }
    if (qty > this.quantityOnHand) {
      throw new ValidationError('Cannot decrement below zero on hand');
    }

    this.quantityOnHand -= qty;
    // Release matching reservation if any
    this.quantityReserved = Math.max(0, this.quantityReserved - qty);
    this.updatedAt = new Date();
  }

  public incrementStock(qty: number): void {
    if (qty <= 0) {
      throw new ValidationError('Increment quantity must be greater than zero');
    }

    if (this.maxCapacity !== null && this.quantityOnHand + qty > this.maxCapacity) {
      throw new ValidationError(`Increment exceeds maximum inventory capacity of ${this.maxCapacity}`);
    }

    this.quantityOnHand += qty;
    this.updatedAt = new Date();
  }

  public recordStockCount(countedQty: number): number {
    if (countedQty < 0) {
      throw new ValidationError('Stocktake count cannot be negative');
    }
    const discrepancy = countedQty - this.quantityOnHand;
    this.quantityOnHand = countedQty;
    this.lastCountedAt = new Date();
    this.updatedAt = new Date();
    return discrepancy;
  }

  public updateThresholds(props: Partial<Pick<InventoryEntryProps, 'lowStockThreshold' | 'reorderPoint' | 'maxCapacity' | 'allowBackorder' | 'backorderLimit'>>): void {
    if (props.lowStockThreshold !== undefined) {
      if (props.lowStockThreshold < 0) throw new ValidationError('Low stock threshold cannot be negative');
      this.lowStockThreshold = props.lowStockThreshold;
    }
    if (props.reorderPoint !== undefined) {
      if (props.reorderPoint < 0) throw new ValidationError('Reorder point cannot be negative');
      this.reorderPoint = props.reorderPoint;
    }
    if (props.maxCapacity !== undefined) {
      this.maxCapacity = props.maxCapacity ? Number(props.maxCapacity) : null;
    }
    if (props.allowBackorder !== undefined) {
      this.allowBackorder = props.allowBackorder;
    }
    if (props.backorderLimit !== undefined) {
      if (props.backorderLimit < 0) throw new ValidationError('Backorder limit cannot be negative');
      this.backorderLimit = props.backorderLimit;
    }
    this.updatedAt = new Date();
  }
}
