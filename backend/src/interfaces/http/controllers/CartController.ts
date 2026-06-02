import { Request, Response } from 'express';
import { container } from '../../../container';
import { ICartRepository } from '../../../infrastructure/persistence/interfaces/ICartRepository';
import { IProductRepository } from '../../../infrastructure/persistence/interfaces/IProductRepository';
import { ICouponRepository } from '../../../infrastructure/persistence/interfaces/ICouponRepository';
import { Cart } from '../../../domain/commerce/Cart';
import { Money } from '../../../domain/shared/value-objects/Money';
import { NotFoundError } from '../../../domain/shared/errors/NotFoundError';
import { ValidationError } from '../../../domain/shared/errors/ValidationError';
import { ApiResponse } from '../../../utils/ApiResponse';
import { randomUUID } from 'crypto';

export class CartController {
  private getCartRepository(): ICartRepository {
    return container.resolve<ICartRepository>('ICartRepository');
  }

  private getProductRepository(): IProductRepository {
    return container.resolve<IProductRepository>('IProductRepository');
  }

  private getCouponRepository(): ICouponRepository {
    return container.resolve<ICouponRepository>('ICouponRepository');
  }

  private async getOrCreateCart(req: Request): Promise<Cart> {
    const repo = this.getCartRepository();
    
    // Attempt authenticated userId lookup
    if (req.user) {
      let cart = await repo.findByUserId(req.user.id);
      if (!cart) {
        cart = new Cart({ userId: req.user.id });
        cart = await repo.save(cart);
      }
      return cart;
    }

    // Fallback to guest session token
    let sessionToken = req.headers['x-guest-session'] as string || req.cookies?.guestSession;
    if (!sessionToken) {
      sessionToken = `guest_${randomUUID()}`;
    }

    let cart = await repo.findBySessionToken(sessionToken);
    if (!cart) {
      cart = new Cart({ sessionToken });
      cart = await repo.save(cart);
    }
    return cart;
  }

  public getCart = async (req: Request, res: Response): Promise<void> => {
    const cart = await this.getOrCreateCart(req);
    
    // Attaching cookie header if guest session is freshly created
    if (!req.user && !req.headers['x-guest-session'] && !req.cookies?.guestSession) {
      res.setHeader('Set-Cookie', `guestSession=${cart.getSessionToken()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}`);
    }

    res.status(200).json(ApiResponse.success(this.serializeCart(cart), 'Cart retrieved successfully'));
  };

  public addItem = async (req: Request, res: Response): Promise<void> => {
    const cart = await this.getOrCreateCart(req);
    const { productId, variantId, quantity } = req.body;

    const productRepo = this.getProductRepository();
    const product = await productRepo.findById(productId);

    if (!product || !product.getIsActive()) {
      throw new NotFoundError('Product not found or inactive');
    }

    // Determine variant modifier if any
    let price = product.getPrice();
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId, isParentActive: true } as any, // wait, attributes matched
      });
      if (variant && variant.priceModifier) {
        price = price.add(new Money(variant.priceModifier, price.getCurrency()));
      }
    }

    cart.addItem(productId, variantId || null, quantity, price);
    const saved = await this.getCartRepository().save(cart);

    res.status(200).json(ApiResponse.success(this.serializeCart(saved), 'Item added to cart'));
  };

  public updateItem = async (req: Request, res: Response): Promise<void> => {
    const cart = await this.getOrCreateCart(req);
    const itemId = req.params.itemId;
    const { quantity } = req.body;

    cart.updateItemQuantity(itemId, quantity);
    const saved = await this.getCartRepository().save(cart);

    res.status(200).json(ApiResponse.success(this.serializeCart(saved), 'Cart item updated'));
  };

  public removeItem = async (req: Request, res: Response): Promise<void> => {
    const cart = await this.getOrCreateCart(req);
    const itemId = req.params.itemId;

    cart.removeItem(itemId);
    const saved = await this.getCartRepository().save(cart);

    res.status(200).json(ApiResponse.success(this.serializeCart(saved), 'Item removed from cart'));
  };

  public applyCoupon = async (req: Request, res: Response): Promise<void> => {
    const cart = await this.getOrCreateCart(req);
    const { code } = req.body;

    const couponRepo = this.getCouponRepository();
    const coupon = await couponRepo.findByCode(code);

    if (!coupon) {
      throw new NotFoundError(`Coupon code "${code}" is invalid`);
    }

    const subtotal = cart.getSubtotal();
    if (!coupon.isApplicable(subtotal)) {
      throw new ValidationError(`Coupon code "${code}" is not applicable to current cart subtotal`);
    }

    const discount = coupon.calculateDiscount(subtotal);
    cart.applyCoupon(coupon.getCode(), discount);

    const saved = await this.getCartRepository().save(cart);

    res.status(200).json(ApiResponse.success(this.serializeCart(saved), 'Coupon applied successfully'));
  };

  public removeCoupon = async (req: Request, res: Response): Promise<void> => {
    const cart = await this.getOrCreateCart(req);
    cart.removeCoupon();

    const saved = await this.getCartRepository().save(cart);
    res.status(200).json(ApiResponse.success(this.serializeCart(saved), 'Coupon removed'));
  };

  public merge = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new ForbiddenError('Authentication required to merge carts');
    }

    const guestSessionToken = req.body.guestSessionToken;
    if (!guestSessionToken) {
      throw new ValidationError('Guest session token is required');
    }

    const repo = this.getCartRepository();
    const guestCart = await repo.findBySessionToken(guestSessionToken);
    const userCart = await this.getOrCreateCart(req);

    if (guestCart && guestCart.getItems().length > 0) {
      // Merge items from guest to user cart
      for (const item of guestCart.getItems()) {
        userCart.addItem(
          item.getProductId(),
          item.getVariantId(),
          item.getQuantity(),
          item.getPriceSnapshot()
        );
      }
      
      // Delete guest cart
      await repo.delete(guestCart.getId()!);
    }

    const saved = await repo.save(userCart);

    res.status(200).json(ApiResponse.success(this.serializeCart(saved), 'Carts merged successfully'));
  };

  private serializeCart(cart: Cart) {
    return {
      id: cart.getId(),
      userId: cart.getUserId(),
      sessionToken: cart.getSessionToken(),
      couponCode: cart.getCouponCode(),
      couponDiscount: cart.getCouponDiscount().getAmount(),
      subtotal: cart.getSubtotal().getAmount(),
      total: cart.getTotal().getAmount(),
      items: cart.getItems().map((item) => ({
        id: item.getId(),
        productId: item.getProductId(),
        variantId: item.getVariantId(),
        quantity: item.getQuantity(),
        priceSnapshot: item.getPriceSnapshot().getAmount(),
        total: item.getTotal().getAmount(),
        addedAt: item.getAddedAt(),
      })),
    };
  }
}
