import { ValidationError } from '../shared/errors/ValidationError';
import { Money } from '../shared/value-objects/Money';
import { AddressProps } from '../shared/value-objects/Address';
import { OrderItem } from './OrderItem';
import { OrderStatus, PaymentStatus, PaymentMethod, DeliveryType } from '@prisma/client';

export interface OrderProps {
  id?: string;
  orderNumber: string;
  userId?: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentIntentId?: string | null;
  stripeChargeId?: string | null;
  subtotal: Money;
  discountAmount?: Money;
  couponCode?: string | null;
  taxAmount?: Money;
  shippingCost?: Money;
  total: Money;
  currency?: string;
  shippingAddress: AddressProps;
  billingAddress: AddressProps;
  deliveryType?: DeliveryType;
  deliverySlotId?: string | null;
  requestedDeliveryDate?: Date | null;
  notes?: string | null;
  internalNotes?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  items?: OrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
  confirmedAt?: Date | null;
  packedAt?: Date | null;
  dispatchedAt?: Date | null;
  deliveredAt?: Date | null;
  cancelledAt?: Date | null;
}

export class Order {
  private readonly id?: string;
  private readonly orderNumber: string;
  private readonly userId: string | null;
  private status: OrderStatus;
  private paymentStatus: PaymentStatus;
  private readonly paymentMethod: PaymentMethod;
  private paymentIntentId: string | null;
  private stripeChargeId: string | null;
  private readonly subtotal: Money;
  private readonly discountAmount: Money;
  private readonly couponCode: string | null;
  private readonly taxAmount: Money;
  private readonly shippingCost: Money;
  private readonly total: Money;
  private readonly currency: string;
  private readonly shippingAddress: AddressProps;
  private readonly billingAddress: AddressProps;
  private readonly deliveryType: DeliveryType;
  private readonly deliverySlotId: string | null;
  private readonly requestedDeliveryDate: Date | null;
  private readonly notes: string | null;
  private internalNotes: string | null;
  private readonly ipAddress: string | null;
  private readonly userAgent: string | null;
  private readonly items: OrderItem[];
  private readonly createdAt: Date;
  private updatedAt: Date;
  private confirmedAt: Date | null;
  private packedAt: Date | null;
  private dispatchedAt: Date | null;
  private deliveredAt: Date | null;
  private cancelledAt: Date | null;

  constructor(props: OrderProps) {
    this.id = props.id;
    this.orderNumber = props.orderNumber;
    this.userId = props.userId ?? null;
    this.status = props.status;
    this.paymentStatus = props.paymentStatus;
    this.paymentMethod = props.paymentMethod;
    this.paymentIntentId = props.paymentIntentId ?? null;
    this.stripeChargeId = props.stripeChargeId ?? null;
    this.subtotal = props.subtotal;
    this.discountAmount = props.discountAmount ?? Money.zero(props.subtotal.getCurrency());
    this.couponCode = props.couponCode ?? null;
    this.taxAmount = props.taxAmount ?? Money.zero(props.subtotal.getCurrency());
    this.shippingCost = props.shippingCost ?? Money.zero(props.subtotal.getCurrency());
    this.total = props.total;
    this.currency = props.currency ?? 'INR';
    this.shippingAddress = props.shippingAddress;
    this.billingAddress = props.billingAddress;
    this.deliveryType = props.deliveryType ?? 'HOME_DELIVERY';
    this.deliverySlotId = props.deliverySlotId ?? null;
    this.requestedDeliveryDate = props.requestedDeliveryDate ?? null;
    this.notes = props.notes ?? null;
    this.internalNotes = props.internalNotes ?? null;
    this.ipAddress = props.ipAddress ?? null;
    this.userAgent = props.userAgent ?? null;
    this.items = props.items ?? [];
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.confirmedAt = props.confirmedAt ?? null;
    this.packedAt = props.packedAt ?? null;
    this.dispatchedAt = props.dispatchedAt ?? null;
    this.deliveredAt = props.deliveredAt ?? null;
    this.cancelledAt = props.cancelledAt ?? null;
  }

  // Getters
  public getId(): string | undefined {
    return this.id;
  }

  public getOrderNumber(): string {
    return this.orderNumber;
  }

  public getUserId(): string | null {
    return this.userId;
  }

  public getStatus(): OrderStatus {
    return this.status;
  }

  public getPaymentStatus(): PaymentStatus {
    return this.paymentStatus;
  }

  public getPaymentMethod(): PaymentMethod {
    return this.paymentMethod;
  }

  public getPaymentIntentId(): string | null {
    return this.paymentIntentId;
  }

  public getStripeChargeId(): string | null {
    return this.stripeChargeId;
  }

  public getSubtotal(): Money {
    return this.subtotal;
  }

  public getDiscountAmount(): Money {
    return this.discountAmount;
  }

  public getCouponCode(): string | null {
    return this.couponCode;
  }

  public getTaxAmount(): Money {
    return this.taxAmount;
  }

  public getShippingCost(): Money {
    return this.shippingCost;
  }

  public getTotal(): Money {
    return this.total;
  }

  public getCurrency(): string {
    return this.currency;
  }

  public getShippingAddress(): AddressProps {
    return this.shippingAddress;
  }

  public getBillingAddress(): AddressProps {
    return this.billingAddress;
  }

  public getDeliveryType(): DeliveryType {
    return this.deliveryType;
  }

  public getDeliverySlotId(): string | null {
    return this.deliverySlotId;
  }

  public getRequestedDeliveryDate(): Date | null {
    return this.requestedDeliveryDate;
  }

  public getNotes(): string | null {
    return this.notes;
  }

  public getInternalNotes(): string | null {
    return this.internalNotes;
  }

  public getIpAddress(): string | null {
    return this.ipAddress;
  }

  public getUserAgent(): string | null {
    return this.userAgent;
  }

  public getItems(): OrderItem[] {
    return this.items;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getConfirmedAt(): Date | null {
    return this.confirmedAt;
  }

  public getPackedAt(): Date | null {
    return this.packedAt;
  }

  public getDispatchedAt(): Date | null {
    return this.dispatchedAt;
  }

  public getDeliveredAt(): Date | null {
    return this.deliveredAt;
  }

  public getCancelledAt(): Date | null {
    return this.cancelledAt;
  }

  // State Machine Transitions
  
  public canTransitionTo(newStatus: OrderStatus): boolean {
    const current = this.status;

    // Define rules for transition
    if (current === 'DRAFT') {
      return ['PENDING_PAYMENT', 'CANCELLED'].includes(newStatus);
    }
    if (current === 'PENDING_PAYMENT') {
      return ['CONFIRMED', 'CANCELLED'].includes(newStatus);
    }
    if (current === 'CONFIRMED') {
      return ['PROCESSING', 'CANCELLED'].includes(newStatus);
    }
    if (current === 'PROCESSING') {
      return ['PACKED', 'CANCELLED'].includes(newStatus);
    }
    if (current === 'PACKED') {
      return ['OUT_FOR_DELIVERY', 'CANCELLED'].includes(newStatus);
    }
    if (current === 'OUT_FOR_DELIVERY') {
      return ['DELIVERED', 'CANCELLED'].includes(newStatus);
    }
    if (current === 'DELIVERED') {
      return ['REFUND_REQUESTED'].includes(newStatus);
    }
    if (current === 'REFUND_REQUESTED') {
      return ['REFUNDED', 'DELIVERED'].includes(newStatus); // DELIVERED state represents rejection of refund request
    }
    
    return false; // Terminal states (CANCELLED, REFUNDED) have no transitions
  }

  public transitionTo(newStatus: OrderStatus): void {
    if (!this.canTransitionTo(newStatus)) {
      throw new ValidationError(`Invalid order status transition from ${this.status} to ${newStatus}`);
    }

    const now = new Date();
    this.status = newStatus;

    if (newStatus === 'CONFIRMED') {
      this.confirmedAt = now;
      if (this.paymentMethod === 'STRIPE') {
        this.paymentStatus = 'PAID';
      }
    }
    if (newStatus === 'PACKED') {
      this.packedAt = now;
    }
    if (newStatus === 'OUT_FOR_DELIVERY') {
      this.dispatchedAt = now;
    }
    if (newStatus === 'DELIVERED') {
      this.deliveredAt = now;
      if (this.paymentMethod === 'CASH_ON_DELIVERY') {
        this.paymentStatus = 'PAID'; // Paid on delivery
      }
    }
    if (newStatus === 'CANCELLED') {
      this.cancelledAt = now;
    }
    if (newStatus === 'REFUNDED') {
      this.paymentStatus = 'FULLY_REFUNDED';
    }

    this.updatedAt = now;
  }

  // Payment Operations
  
  public attachPaymentDetails(intentId: string, chargeId?: string): void {
    this.paymentIntentId = intentId;
    if (chargeId) this.stripeChargeId = chargeId;
    this.updatedAt = new Date();
  }

  public updateInternalNotes(notes: string): void {
    this.internalNotes = notes;
    this.updatedAt = new Date();
  }
}
