import { Cart } from '../../../../domain/commerce/Cart';
import { Address } from '../../../../domain/shared/value-objects/Address';
import { Coupon } from '../../../../domain/commerce/Coupon';
import { PaymentMethod, DeliveryType } from '@prisma/client';

export interface CheckoutContext {
  userId: string;
  cart: Cart;
  shippingAddress: Address;
  deliveryType: DeliveryType;
  coupon?: Coupon | null;
  paymentMethod: PaymentMethod;
  ipAddress?: string;
  userAgent?: string;
}
