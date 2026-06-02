import { ValidationError } from '../shared/errors/ValidationError';
import { CartItem } from './CartItem';
import { Money } from '../shared/value-objects/Money';

export interface CartProps {
  id?: string;
  userId?: string | null;
  sessionToken?: string | null;
  couponCode?: string | null;
  couponDiscount?: Money;
  expiresAt?: Date | null;
  items?: CartItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Cart {
  private readonly id?: string;
  private readonly userId: string | null;
  private readonly sessionToken: string | null;
  private couponCode: string | null;
  private couponDiscount: Money;
  private expiresAt: Date | null;
  private items: CartItem[];
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: CartProps) {
    this.id = props.id;
    this.userId = props.userId ?? null;
    this.sessionToken = props.sessionToken ?? null;
    this.couponCode = props.couponCode ?? null;
    this.couponDiscount = props.couponDiscount ?? Money.zero();
    this.expiresAt = props.expiresAt ?? null;
    this.items = props.items ?? [];
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getUserId(): string | null {
    return this.userId;
  }

  public getSessionToken(): string | null {
    return this.sessionToken;
  }

  public getCouponCode(): string | null {
    return this.couponCode;
  }

  public getCouponDiscount(): Money {
    return this.couponDiscount;
  }

  public getExpiresAt(): Date | null {
    return this.expiresAt;
  }

  public getItems(): CartItem[] {
    return this.items;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Calculation operations
  
  public getSubtotal(): Money {
    if (this.items.length === 0) {
      return Money.zero();
    }
    return this.items.reduce((sum, item) => sum.add(item.getTotal()), Money.zero(this.items[0].getPriceSnapshot().getCurrency()));
  }

  public getTotal(): Money {
    const subtotal = this.getSubtotal();
    if (this.couponDiscount.greaterThanOrEqual(subtotal)) {
      return Money.zero(subtotal.getCurrency());
    }
    return subtotal.subtract(this.couponDiscount);
  }

  // Mutation operations
  
  public addItem(productId: string, variantId: string | null, quantity: number, price: Money): void {
    if (quantity <= 0) throw new ValidationError('Quantity must be greater than zero');
    
    const existing = this.items.find((item) => item.getProductId() === productId && item.getVariantId() === variantId);
    
    if (existing) {
      existing.incrementQuantity(quantity);
      existing.updatePriceSnapshot(price); // Keep snapshot updated
    } else {
      this.items.push(new CartItem({
        cartId: this.id || 'new-cart',
        productId,
        variantId,
        quantity,
        priceSnapshot: price,
      }));
    }
    this.updatedAt = new Date();
  }

  public updateItemQuantity(itemId: string, quantity: number): void {
    const item = this.items.find((item) => item.getId() === itemId);
    if (!item) {
      throw new ValidationError(`CartItem with ID ${itemId} not found in cart`);
    }
    item.updateQuantity(quantity);
    this.updatedAt = new Date();
  }

  public removeItem(itemId: string): void {
    const index = this.items.findIndex((item) => item.getId() === itemId);
    if (index === -1) {
      throw new ValidationError(`CartItem with ID ${itemId} not found in cart`);
    }
    this.items.splice(index, 1);
    this.updatedAt = new Date();
  }

  public applyCoupon(code: string, discount: Money): void {
    if (discount.getAmount() < 0) {
      throw new ValidationError('Coupon discount cannot be negative');
    }
    this.couponCode = code.toUpperCase();
    this.couponDiscount = discount;
    this.updatedAt = new Date();
  }

  public removeCoupon(): void {
    this.couponCode = null;
    this.couponDiscount = Money.zero();
    this.updatedAt = new Date();
  }

  public clear(): void {
    this.items = [];
    this.couponCode = null;
    this.couponDiscount = Money.zero();
    this.updatedAt = new Date();
  }
}
