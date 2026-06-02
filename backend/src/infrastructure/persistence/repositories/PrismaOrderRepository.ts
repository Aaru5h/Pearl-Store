import { injectable } from 'tsyringe';
import { IOrderRepository, OrderQueryFilters } from '../interfaces/IOrderRepository';
import { Order } from '../../../domain/commerce/Order';
import { OrderItem } from '../../../domain/commerce/OrderItem';
import { Money } from '../../../domain/shared/value-objects/Money';
import { AddressProps } from '../../../domain/shared/value-objects/Address';
import { prisma } from '../prisma/PrismaClient';
import { OrderStatus, Prisma } from '@prisma/client';

@injectable()
export class PrismaOrderRepository implements IOrderRepository {
  public async findById(id: string): Promise<Order | null> {
    const raw = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const raw = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async findManyByUserId(
    userId: string,
    page: number,
    limit: number,
    status?: OrderStatus
  ): Promise<{ items: Order[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = { userId };
    if (status) {
      where.status = status;
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { items: true },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      items: items.map((o) => this.toDomain(o)),
      total,
    };
  }

  public async findMany(filters: OrderQueryFilters): Promise<{ items: Order[]; total: number }> {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    if (filters.status) where.status = filters.status;
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus as any;
    if (filters.deliveryType) where.deliveryType = filters.deliveryType as any;

    if (filters.dateFrom || filters.dateTo) {
      const dateFilter: Prisma.DateTimeFilter = {};
      if (filters.dateFrom) dateFilter.gte = filters.dateFrom;
      if (filters.dateTo) dateFilter.lte = filters.dateTo;
      where.createdAt = dateFilter;
    }

    if (filters.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { user: { email: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    let orderBy: Prisma.OrderOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters.sortBy) {
      if (filters.sortBy === 'oldest') orderBy = { createdAt: 'asc' };
      if (filters.sortBy === 'total_desc') orderBy = { total: 'desc' };
      if (filters.sortBy === 'total_asc') orderBy = { total: 'asc' };
    }

    const [items, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { items: true },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      items: items.map((o) => this.toDomain(o)),
      total,
    };
  }

  public async save(order: Order): Promise<Order> {
    const id = order.getId();
    const data = {
      orderNumber: order.getOrderNumber(),
      userId: order.getUserId(),
      status: order.getStatus(),
      paymentStatus: order.getPaymentStatus(),
      paymentMethod: order.getPaymentMethod(),
      paymentIntentId: order.getPaymentIntentId(),
      stripeChargeId: order.getStripeChargeId(),
      subtotal: order.getSubtotal().getAmount(),
      discountAmount: order.getDiscountAmount().getAmount(),
      couponCode: order.getCouponCode(),
      taxAmount: order.getTaxAmount().getAmount(),
      shippingCost: order.getShippingCost().getAmount(),
      total: order.getTotal().getAmount(),
      currency: order.getCurrency(),
      shippingAddress: order.getShippingAddress() as any,
      billingAddress: order.getBillingAddress() as any,
      deliveryType: order.getDeliveryType(),
      deliverySlotId: order.getDeliverySlotId(),
      requestedDeliveryDate: order.getRequestedDeliveryDate(),
      notes: order.getNotes(),
      internalNotes: order.getInternalNotes(),
      ipAddress: order.getIpAddress(),
      userAgent: order.getUserAgent(),
      confirmedAt: order.getConfirmedAt(),
      packedAt: order.getPackedAt(),
      dispatchedAt: order.getDispatchedAt(),
      deliveredAt: order.getDeliveredAt(),
      cancelledAt: order.getCancelledAt(),
      updatedAt: new Date(),
    };

    let savedRaw;
    if (id) {
      savedRaw = await prisma.order.update({
        where: { id },
        data,
      });
    } else {
      savedRaw = await prisma.order.create({
        data: {
          ...data,
          createdAt: order.getCreatedAt(),
        },
      });
    }

    // Save order items
    const itemPromises = order.getItems().map(async (item) => {
      const itemId = item.getId();
      const itemData = {
        orderId: savedRaw.id,
        productId: item.getProductId(),
        variantId: item.getVariantId(),
        productName: item.getProductName(),
        productSku: item.getProductSku(),
        productImage: item.getProductImage(),
        unit: item.getUnit(),
        quantity: item.getQuantity(),
        unitPrice: item.getUnitPrice().getAmount(),
        taxRate: new Prisma.Decimal(item.getTaxRate()),
        taxAmount: item.getTaxAmount().getAmount(),
        totalPrice: item.getTotalPrice().getAmount(),
      };

      if (itemId && id) {
        return prisma.orderItem.upsert({
          where: { id: itemId },
          create: itemData,
          update: itemData,
        });
      } else {
        return prisma.orderItem.create({
          data: itemData,
        });
      }
    });

    await Promise.all(itemPromises);

    // Fetch fully updated aggregate
    const refreshed = await prisma.order.findUnique({
      where: { id: savedRaw.id },
      include: { items: true },
    });

    return this.toDomain(refreshed);
  }

  public async generateNextOrderNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.order.count();
    const sequence = String(count + 1).padStart(5, '0');
    return `GS-${year}-${sequence}`;
  }

  private toDomain(raw: any): Order {
    const items = raw.items.map((item: any) => {
      return new OrderItem({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.productName,
        productSku: item.productSku,
        productImage: item.productImage,
        unit: item.unit,
        quantity: item.quantity,
        unitPrice: new Money(item.unitPrice, 'INR'),
        taxRate: Number(item.taxRate),
        taxAmount: new Money(item.taxAmount, 'INR'),
        totalPrice: new Money(item.totalPrice, 'INR'),
      });
    });

    return new Order({
      id: raw.id,
      orderNumber: raw.orderNumber,
      userId: raw.userId,
      status: raw.status as OrderStatus,
      paymentStatus: raw.paymentStatus,
      paymentMethod: raw.paymentMethod,
      paymentIntentId: raw.paymentIntentId,
      stripeChargeId: raw.stripeChargeId,
      subtotal: new Money(raw.subtotal, 'INR'),
      discountAmount: new Money(raw.discountAmount, 'INR'),
      couponCode: raw.couponCode,
      taxAmount: new Money(raw.taxAmount, 'INR'),
      shippingCost: new Money(raw.shippingCost, 'INR'),
      total: new Money(raw.total, 'INR'),
      currency: raw.currency,
      shippingAddress: raw.shippingAddress as AddressProps,
      billingAddress: raw.billingAddress as AddressProps,
      deliveryType: raw.deliveryType,
      deliverySlotId: raw.deliverySlotId,
      requestedDeliveryDate: raw.requestedDeliveryDate,
      notes: raw.notes,
      internalNotes: raw.internalNotes,
      ipAddress: raw.ipAddress,
      userAgent: raw.userAgent,
      items,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      confirmedAt: raw.confirmedAt,
      packedAt: raw.packedAt,
      dispatchedAt: raw.dispatchedAt,
      deliveredAt: raw.deliveredAt,
      cancelledAt: raw.cancelledAt,
    });
  }
}
