import { injectable } from 'tsyringe';
import { ICartRepository } from '../interfaces/ICartRepository';
import { Cart } from '../../../domain/commerce/Cart';
import { CartItem } from '../../../domain/commerce/CartItem';
import { Money } from '../../../domain/shared/value-objects/Money';
import { prisma } from '../prisma/PrismaClient';

@injectable()
export class PrismaCartRepository implements ICartRepository {
  public async findById(id: string): Promise<Cart | null> {
    const raw = await prisma.cart.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async findByUserId(userId: string): Promise<Cart | null> {
    const raw = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async findBySessionToken(sessionToken: string): Promise<Cart | null> {
    const raw = await prisma.cart.findUnique({
      where: { sessionToken },
      include: { items: true },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async save(cart: Cart): Promise<Cart> {
    const id = cart.getId();
    const data = {
      userId: cart.getUserId(),
      sessionToken: cart.getSessionToken(),
      couponCode: cart.getCouponCode(),
      couponDiscount: cart.getCouponDiscount().getAmount(),
      expiresAt: cart.getExpiresAt(),
      updatedAt: new Date(),
    };

    let savedRaw;
    if (id) {
      // Clean up items not present in domain list (syncing logic)
      const domainItemIds = cart.getItems().map(item => item.getId()).filter(Boolean) as string[];
      await prisma.cartItem.deleteMany({
        where: {
          cartId: id,
          id: { notIn: domainItemIds },
        },
      });

      // Update basic fields
      savedRaw = await prisma.cart.update({
        where: { id },
        data,
      });
    } else {
      // Create new cart record
      savedRaw = await prisma.cart.create({
        data: {
          ...data,
          createdAt: cart.getCreatedAt(),
        },
      });
    }

    // Save cart items recursively
    const itemPromises = cart.getItems().map(async (item) => {
      const itemId = item.getId();
      const itemData = {
        cartId: savedRaw.id,
        productId: item.getProductId(),
        variantId: item.getVariantId(),
        quantity: item.getQuantity(),
        priceSnapshot: item.getPriceSnapshot().getAmount(),
      };

      if (itemId && id) {
        return prisma.cartItem.upsert({
          where: { id: itemId },
          create: itemData,
          update: itemData,
        });
      } else {
        return prisma.cartItem.create({
          data: {
            ...itemData,
            addedAt: item.getAddedAt(),
          },
        });
      }
    });

    await Promise.all(itemPromises);

    // Resolve refreshed state
    const refreshed = await prisma.cart.findUnique({
      where: { id: savedRaw.id },
      include: { items: true },
    });

    return this.toDomain(refreshed);
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await prisma.cart.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  private toDomain(raw: any): Cart {
    const items = raw.items.map((item: any) => {
      return new CartItem({
        id: item.id,
        cartId: item.cartId,
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        priceSnapshot: new Money(item.priceSnapshot, 'INR'),
        addedAt: item.addedAt,
      });
    });

    return new Cart({
      id: raw.id,
      userId: raw.userId,
      sessionToken: raw.sessionToken,
      couponCode: raw.couponCode,
      couponDiscount: new Money(raw.couponDiscount, 'INR'),
      expiresAt: raw.expiresAt,
      items,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
