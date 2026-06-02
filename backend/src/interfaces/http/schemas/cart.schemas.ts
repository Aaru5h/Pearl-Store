import { z } from 'zod';
import { DeliveryType, PaymentMethod } from '@prisma/client';

export const addToCartSchema = z.object({
  productId: z.string().uuid('Invalid Product ID'),
  variantId: z.string().uuid('Invalid Variant ID').nullable().optional(),
  quantity: z.coerce.number().int().positive('Quantity must be greater than zero'),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().positive('Quantity must be greater than zero'),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
});

export const checkoutCalculateSchema = z.object({
  addressId: z.string().uuid('Invalid Address ID'),
  deliveryType: z.nativeEnum(DeliveryType),
  couponCode: z.string().optional().nullable(),
});

export const checkoutSchema = z.object({
  addressId: z.string().uuid('Invalid Address ID'),
  deliveryType: z.nativeEnum(DeliveryType),
  deliverySlotId: z.string().uuid('Invalid Delivery Slot ID').optional().nullable(),
  couponCode: z.string().optional().nullable(),
  paymentMethod: z.nativeEnum(PaymentMethod),
});
