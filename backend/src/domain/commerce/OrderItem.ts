import { ValidationError } from '../shared/errors/ValidationError';
import { Money } from '../shared/value-objects/Money';

export interface OrderItemProps {
  id?: string;
  orderId: string;
  productId?: string | null;
  variantId?: string | null;
  productName: string;
  productSku: string;
  productImage?: string | null;
  unit: string;
  quantity: number;
  unitPrice: Money;
  taxRate: number; // Decimal (e.g. 18.00)
  taxAmount: Money;
  totalPrice: Money;
}

export class OrderItem {
  private readonly id?: string;
  private readonly orderId: string;
  private readonly productId: string | null;
  private readonly variantId: string | null;
  private readonly productName: string;
  private readonly productSku: string;
  private readonly productImage: string | null;
  private readonly unit: string;
  private readonly quantity: number;
  private readonly unitPrice: Money;
  private readonly taxRate: number;
  private readonly taxAmount: Money;
  private readonly totalPrice: Money;

  constructor(props: OrderItemProps) {
    this.validate(props);
    this.id = props.id;
    this.orderId = props.orderId;
    this.productId = props.productId ?? null;
    this.variantId = props.variantId ?? null;
    this.productName = props.productName;
    this.productSku = props.productSku;
    this.productImage = props.productImage ?? null;
    this.unit = props.unit;
    this.quantity = props.quantity;
    this.unitPrice = props.unitPrice;
    this.taxRate = props.taxRate;
    this.taxAmount = props.taxAmount;
    this.totalPrice = props.totalPrice;
  }

  private validate(props: OrderItemProps): void {
    if (!props.orderId) throw new ValidationError('Order ID is required for order items');
    if (!props.productName) throw new ValidationError('Product name snapshot is required');
    if (!props.productSku) throw new ValidationError('Product SKU snapshot is required');
    if (props.quantity <= 0) throw new ValidationError('Quantity must be greater than zero');
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getOrderId(): string {
    return this.orderId;
  }

  public getProductId(): string | null {
    return this.productId;
  }

  public getVariantId(): string | null {
    return this.variantId;
  }

  public getProductName(): string {
    return this.productName;
  }

  public getProductSku(): string {
    return this.productSku;
  }

  public getProductImage(): string | null {
    return this.productImage;
  }

  public getUnit(): string {
    return this.unit;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getUnitPrice(): Money {
    return this.unitPrice;
  }

  public getTaxRate(): number {
    return this.taxRate;
  }

  public getTaxAmount(): Money {
    return this.taxAmount;
  }

  public getTotalPrice(): Money {
    return this.totalPrice;
  }
}
