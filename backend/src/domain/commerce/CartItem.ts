import { ValidationError } from '../shared/errors/ValidationError';
import { Money } from '../shared/value-objects/Money';

export interface CartItemProps {
  id?: string;
  cartId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  priceSnapshot: Money; // Snapshot at the time of adding
  addedAt?: Date;
}

export class CartItem {
  private readonly id?: string;
  private readonly cartId: string;
  private readonly productId: string;
  private readonly variantId: string | null;
  private quantity: number;
  private priceSnapshot: Money;
  private readonly addedAt: Date;

  constructor(props: CartItemProps) {
    this.validate(props);
    this.id = props.id;
    this.cartId = props.cartId;
    this.productId = props.productId;
    this.variantId = props.variantId ?? null;
    this.quantity = props.quantity;
    this.priceSnapshot = props.priceSnapshot;
    this.addedAt = props.addedAt ?? new Date();
  }

  private validate(props: CartItemProps): void {
    if (!props.cartId) throw new ValidationError('Cart ID is required for cart items');
    if (!props.productId) throw new ValidationError('Product ID is required for cart items');
    if (props.quantity <= 0) throw new ValidationError('Quantity must be greater than zero');
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getCartId(): string {
    return this.cartId;
  }

  public getProductId(): string {
    return this.productId;
  }

  public getVariantId(): string | null {
    return this.variantId;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getPriceSnapshot(): Money {
    return this.priceSnapshot;
  }

  public getAddedAt(): Date {
    return this.addedAt;
  }

  // Domain Actions
  public updateQuantity(qty: number): void {
    if (qty <= 0) throw new ValidationError('Quantity must be greater than zero');
    this.quantity = qty;
  }

  public incrementQuantity(qty: number): void {
    if (qty <= 0) throw new ValidationError('Increment quantity must be greater than zero');
    this.quantity += qty;
  }

  public updatePriceSnapshot(price: Money): void {
    this.priceSnapshot = price;
  }

  public getTotal(): Money {
    return this.priceSnapshot.multiply(this.quantity);
  }
}
