import { inject, injectable } from 'tsyringe';
import { ICartRepository } from '../../../infrastructure/persistence/interfaces/ICartRepository';
import { IOrderRepository } from '../../../infrastructure/persistence/interfaces/IOrderRepository';
import { ICouponRepository } from '../../../infrastructure/persistence/interfaces/ICouponRepository';
import { IInventoryRepository } from '../../../infrastructure/persistence/interfaces/IInventoryRepository';
import { IShippingCalculator } from '../../../infrastructure/shipping/IShippingCalculator';
import { IPaymentProcessor } from '../../../infrastructure/payment/IPaymentProcessor';
import { StockValidationHandler } from './validation-pipeline/StockValidationHandler';
import { PriceIntegrityHandler } from './validation-pipeline/PriceIntegrityHandler';
import { CouponValidationHandler } from './validation-pipeline/CouponValidationHandler';
import { FraudCheckHandler } from './validation-pipeline/FraudCheckHandler';
import { Address, AddressProps } from '../../../domain/shared/value-objects/Address';
import { Money } from '../../../domain/shared/value-objects/Money';
import { Order } from '../../../domain/commerce/Order';
import { OrderItem } from '../../../domain/commerce/OrderItem';
import { EventBus } from '../../../domain/shared/events/EventBus';
import { NotFoundError } from '../../../domain/shared/errors/NotFoundError';
import { ValidationError } from '../../../domain/shared/errors/ValidationError';
import { prisma } from '../../../infrastructure/persistence/prisma/PrismaClient';
import { DeliveryType, PaymentMethod, OrderStatus } from '@prisma/client';
import { logger } from '../../../config/logger';

export interface CheckoutCalculationResult {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface CheckoutResult {
  orderId: string;
  orderNumber: string;
  clientSecret?: string; // Stripe PaymentIntent Secret
}

@injectable()
export class CheckoutFacade {
  constructor(
    @inject('ICartRepository') private cartRepository: ICartRepository,
    @inject('IOrderRepository') private orderRepository: IOrderRepository,
    @inject('ICouponRepository') private couponRepository: ICouponRepository,
    @inject('IInventoryRepository') private inventoryRepository: IInventoryRepository,
    @inject('IShippingCalculator') private shippingCalculator: IShippingCalculator,
    @inject('StripePaymentProcessor') private stripeProcessor: IPaymentProcessor,
    @inject('CodPaymentProcessor') private codProcessor: IPaymentProcessor,
    @inject('EventBus') private eventBus: EventBus,
    private stockVal: StockValidationHandler,
    private priceVal: PriceIntegrityHandler,
    private couponVal: CouponValidationHandler,
    private fraudVal: FraudCheckHandler
  ) {}

  public async calculate(
    userId: string,
    addressId: string,
    deliveryType: DeliveryType,
    couponCode?: string | null
  ): Promise<CheckoutCalculationResult> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart || cart.getItems().length === 0) {
      throw new ValidationError('Cart is empty');
    }

    const subtotal = cart.getSubtotal();
    const currency = subtotal.getCurrency();

    // 1. Resolve shipping address
    const dbAddress = await prisma.address.findUnique({ where: { id: addressId, deletedAt: null } });
    if (!dbAddress || dbAddress.userId !== userId) {
      throw new NotFoundError('Shipping address not found');
    }
    const address = new Address(dbAddress as any);

    // 2. Resolve Coupon
    let discount = Money.zero(currency);
    if (couponCode) {
      const coupon = await this.couponRepository.findByCode(couponCode);
      if (coupon && coupon.isApplicable(subtotal)) {
        discount = coupon.calculateDiscount(subtotal);
      }
    }

    // 3. Resolve Shipping (Flat rate for pickup, calculated strategy for delivery)
    let shipping = Money.zero(currency);
    if (deliveryType === 'HOME_DELIVERY') {
      shipping = await this.shippingCalculator.calculate(address, 1000, subtotal); // default weight mock: 1kg
    }

    // 4. Resolve tax (18% of taxable subtotal)
    const taxableSubtotal = subtotal.subtract(discount);
    const tax = taxableSubtotal.multiply(0.18);

    // 5. Total
    const total = taxableSubtotal.add(tax).add(shipping);

    return {
      subtotal: subtotal.getAmount(),
      discount: discount.getAmount(),
      tax: tax.getAmount(),
      shipping: shipping.getAmount(),
      total: total.getAmount(),
    };
  }

  public async checkout(
    userId: string,
    addressId: string,
    deliveryType: DeliveryType,
    deliverySlotId: string | null,
    couponCode: string | null,
    paymentMethod: PaymentMethod,
    ipAddress?: string,
    userAgent?: string
  ): Promise<CheckoutResult> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart || cart.getItems().length === 0) {
      throw new ValidationError('Cart is empty');
    }

    // 1. Resolve Shipping Address
    const dbAddress = await prisma.address.findUnique({ where: { id: addressId, deletedAt: null } });
    if (!dbAddress || dbAddress.userId !== userId) {
      throw new NotFoundError('Shipping address not found');
    }
    const address = new Address(dbAddress as any);

    // 2. Resolve Coupon
    let coupon = null;
    if (couponCode) {
      coupon = await this.couponRepository.findByCode(couponCode);
    }

    // 3. Run validation pipeline
    const validationContext = {
      userId,
      cart,
      shippingAddress: address,
      deliveryType,
      coupon,
      paymentMethod,
      ipAddress,
      userAgent,
    };

    this.stockVal.setNext(this.priceVal).setNext(this.couponVal).setNext(this.fraudVal);
    await this.stockVal.handle(validationContext);

    // 4. Calculate prices
    const calculation = await this.calculate(userId, addressId, deliveryType, couponCode);

    // 5. Reserve Inventory
    const prismaTx = await prisma.$transaction(async (tx) => {
      // Loop over items, decrement available (via incrementing reserved)
      for (const item of cart.getItems()) {
        const inventory = await tx.inventory.findUnique({
          where: { productId: item.getProductId() },
        });

        if (!inventory) {
          throw new ValidationError('Stock record missing');
        }

        // Increment reservations
        await tx.inventory.update({
          where: { productId: item.getProductId() },
          data: {
            quantityReserved: { increment: item.getQuantity() },
          },
        });

        // Record reservation adjustment transaction
        await tx.inventoryTransaction.create({
          data: {
            productId: item.getProductId(),
            type: 'RESERVED',
            quantityChange: item.getQuantity(),
            quantityBefore: inventory.quantityOnHand,
            quantityAfter: inventory.quantityOnHand, // doesn't affect onHand yet
            referenceType: 'CHECKOUT',
            note: 'Stock reserved during checkout facade',
          },
        });
      }

      // Generate order number
      const nextOrderNum = await this.orderRepository.generateNextOrderNumber();

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: nextOrderNum,
          userId,
          status: paymentMethod === 'STRIPE' ? 'PENDING_PAYMENT' : 'CONFIRMED',
          paymentStatus: 'UNPAID',
          paymentMethod,
          subtotal: calculation.subtotal,
          discountAmount: calculation.discount,
          couponCode: couponCode || null,
          taxAmount: calculation.tax,
          shippingCost: calculation.shipping,
          total: calculation.total,
          currency: 'INR',
          shippingAddress: dbAddress as any,
          billingAddress: dbAddress as any,
          deliveryType,
          deliverySlotId: deliverySlotId || null,
          notes: cart.getCouponCode() ? `Applied: ${cart.getCouponCode()}` : null,
          ipAddress: ipAddress || null,
          userAgent: userAgent || null,
          items: {
            create: await Promise.all(
              cart.getItems().map(async (item) => {
                const prod = await tx.product.findUnique({ where: { id: item.getProductId() } });
                const taxAmt = item.getTotal().multiply(0.18).getAmount();
                return {
                  productId: item.getProductId(),
                  variantId: item.getVariantId(),
                  productName: prod!.name,
                  productSku: prod!.sku,
                  productImage: null,
                  unit: prod!.unit,
                  quantity: item.getQuantity(),
                  unitPrice: item.getPriceSnapshot().getAmount(),
                  taxRate: new Prisma.Decimal(18.0),
                  taxAmount: taxAmt,
                  totalPrice: item.getTotal().getAmount(),
                };
              })
            ),
          },
        },
      });

      // Log Order status change
      await tx.orderStatusHistory.create({
        data: {
          orderId: newOrder.id,
          fromStatus: null,
          toStatus: newOrder.status,
          note: 'Order created via checkout facade',
        },
      });

      // Audit logs
      await tx.auditLog.create({
        data: {
          actorId: userId,
          actorRole: 'CUSTOMER',
          action: 'ORDER_CREATED',
          entityType: 'ORDER',
          entityId: newOrder.id,
          newValue: newOrder as any,
        },
      });

      return newOrder;
    });

    // 6. Process Payments
    let clientSecret: string | undefined;
    let paymentIntentId: string | undefined;

    if (paymentMethod === 'STRIPE') {
      const stripeRes = await this.stripeProcessor.createPaymentIntent(
        new Money(calculation.total, 'INR'),
        { orderId: prismaTx.id, orderNumber: prismaTx.orderNumber }
      );
      clientSecret = stripeRes.clientSecret;
      paymentIntentId = stripeRes.paymentIntentId;

      // Update Order with Stripe payment intent ID
      await prisma.order.update({
        where: { id: prismaTx.id },
        data: { paymentIntentId },
      });

      // Clear the Cart Items
      cart.clear();
      await this.cartRepository.save(cart);
    } else {
      // Cash on delivery: complete confirmation directly, decrement onHand
      await prisma.$transaction(async (tx) => {
        for (const item of cart.getItems()) {
          // Decrement stock levels
          await tx.inventory.update({
            where: { productId: item.getProductId() },
            data: {
              quantityOnHand: { decrement: item.getQuantity() },
              quantityReserved: { decrement: item.getQuantity() },
            },
          });

          // Record adjustment transaction
          const inv = await tx.inventory.findUnique({ where: { productId: item.getProductId() } });
          await tx.inventoryTransaction.create({
            data: {
              productId: item.getProductId(),
              type: 'SALE',
              quantityChange: -item.getQuantity(),
              quantityBefore: inv!.quantityOnHand + item.getQuantity(),
              quantityAfter: inv!.quantityOnHand,
              referenceType: 'ORDER',
              referenceId: prismaTx.id,
              note: `COD Order confirmed. SKU: ${item.getProductId()}`,
            },
          });
        }
      });

      // Clear cart
      cart.clear();
      await this.cartRepository.save(cart);

      // Emit OrderPlacedEvent
      this.eventBus.publish({
        occurredAt: new Date(),
        eventName: 'OrderPlacedEvent',
        orderId: prismaTx.id,
        userId,
      } as any).catch(e => logger.error('Event bus publication failed:', e));
    }

    return {
      orderId: prismaTx.id,
      orderNumber: prismaTx.orderNumber,
      clientSecret,
    };
  }
}
