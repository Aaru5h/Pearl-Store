import { ValidationError } from '../shared/errors/ValidationError';
import { Money } from '../shared/value-objects/Money';

export type CouponType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_X_GET_Y';
export type CouponApplicability = 'ALL' | 'CATEGORY' | 'PRODUCT';

export interface CouponProps {
  id?: string;
  code: string;
  description?: string | null;
  type: CouponType;
  value: number; // Stored as integer (either percentage e.g. 10 or fixed amount in cents/paise e.g. 50000)
  minOrderAmount?: number;
  maxDiscountCap?: number | null;
  maxUsesTotal?: number | null;
  maxUsesPerUser?: number;
  usesCount?: number;
  applicableTo?: CouponApplicability;
  applicableIds?: string[];
  validFrom?: Date | null;
  validUntil?: Date | null;
  isActive?: boolean;
  createdBy?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Coupon {
  private readonly id?: string;
  private readonly code: string;
  private readonly description: string | null;
  private readonly type: CouponType;
  private readonly value: number;
  private readonly minOrderAmount: number;
  private readonly maxDiscountCap: number | null;
  private readonly maxUsesTotal: number | null;
  private readonly maxUsesPerUser: number;
  private usesCount: number;
  private readonly applicableTo: CouponApplicability;
  private readonly applicableIds: string[];
  private readonly validFrom: Date | null;
  private readonly validUntil: Date | null;
  private isActive: boolean;
  private readonly createdBy: string | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: CouponProps) {
    this.validate(props);
    this.id = props.id;
    this.code = props.code.trim().toUpperCase();
    this.description = props.description ?? null;
    this.type = props.type;
    this.value = props.value;
    this.minOrderAmount = props.minOrderAmount ?? 0;
    this.maxDiscountCap = props.maxDiscountCap ?? null;
    this.maxUsesTotal = props.maxUsesTotal ?? null;
    this.maxUsesPerUser = props.maxUsesPerUser ?? 1;
    this.usesCount = props.usesCount ?? 0;
    this.applicableTo = props.applicableTo ?? 'ALL';
    this.applicableIds = props.applicableIds ?? [];
    this.validFrom = props.validFrom ?? null;
    this.validUntil = props.validUntil ?? null;
    this.isActive = props.isActive ?? true;
    this.createdBy = props.createdBy ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: CouponProps): void {
    if (!props.code || props.code.trim().length === 0) {
      throw new ValidationError('Coupon code is required');
    }
    if (props.value <= 0) {
      throw new ValidationError('Coupon value must be greater than zero');
    }
    if (props.type === 'PERCENTAGE' && props.value > 100) {
      throw new ValidationError('Percentage discount value cannot exceed 100%');
    }
    if (props.minOrderAmount !== undefined && props.minOrderAmount < 0) {
      throw new ValidationError('Min order amount cannot be negative');
    }
    if (props.maxDiscountCap !== undefined && props.maxDiscountCap !== null && props.maxDiscountCap < 0) {
      throw new ValidationError('Max discount cap cannot be negative');
    }
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getCode(): string {
    return this.code;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public getType(): CouponType {
    return this.type;
  }

  public getValue(): number {
    return this.value;
  }

  public getMinOrderAmount(): number {
    return this.minOrderAmount;
  }

  public getMaxDiscountCap(): number | null {
    return this.maxDiscountCap;
  }

  public getMaxUsesTotal(): number | null {
    return this.maxUsesTotal;
  }

  public getMaxUsesPerUser(): number {
    return this.maxUsesPerUser;
  }

  public getUsesCount(): number {
    return this.usesCount;
  }

  public getApplicableTo(): CouponApplicability {
    return this.applicableTo;
  }

  public getApplicableIds(): string[] {
    return this.applicableIds;
  }

  public getValidFrom(): Date | null {
    return this.validFrom;
  }

  public getValidUntil(): Date | null {
    return this.validUntil;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getCreatedBy(): string | null {
    return this.createdBy;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Domain Business Methods
  
  public isApplicable(subtotal: Money): boolean {
    if (!this.isActive) return false;
    
    const now = new Date();
    if (this.validFrom && this.validFrom > now) return false;
    if (this.validUntil && this.validUntil < now) return false;
    
    if (this.maxUsesTotal !== null && this.usesCount >= this.maxUsesTotal) return false;
    
    const minAmt = new Money(this.minOrderAmount, subtotal.getCurrency());
    if (subtotal.lessThan(minAmt)) return false;

    return true;
  }

  public calculateDiscount(subtotal: Money): Money {
    if (!this.isApplicable(subtotal)) {
      return Money.zero(subtotal.getCurrency());
    }

    if (this.type === 'FIXED_AMOUNT') {
      const discount = new Money(this.value, subtotal.getCurrency());
      return discount.greaterThan(subtotal) ? subtotal : discount;
    }

    if (this.type === 'PERCENTAGE') {
      // value represents percentage (e.g. 10 = 10%)
      const discount = subtotal.multiply(this.value / 100);
      if (this.maxDiscountCap !== null) {
        const cap = new Money(this.maxDiscountCap, subtotal.getCurrency());
        return discount.greaterThan(cap) ? cap : discount;
      }
      return discount;
    }

    // Default or Free shipping types return zero direct cash value, handled at checkout logic
    return Money.zero(subtotal.getCurrency());
  }

  public incrementUsage(): void {
    if (this.maxUsesTotal !== null && this.usesCount >= this.maxUsesTotal) {
      throw new ValidationError('Coupon usage limit reached');
    }
    this.usesCount += 1;
    this.updatedAt = new Date();
  }

  public deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }
}
