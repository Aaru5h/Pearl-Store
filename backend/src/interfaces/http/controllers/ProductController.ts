import { Request, Response } from 'express';
import { container } from '../../../container';
import { IProductRepository } from '../../../infrastructure/persistence/interfaces/IProductRepository';
import { IReviewRepository } from '../../../infrastructure/persistence/interfaces/IReviewRepository';
import { RedisCacheService } from '../../../infrastructure/cache/RedisCacheService';
import { Review } from '../../../domain/catalogue/Review';
import { NotFoundError } from '../../../domain/shared/errors/NotFoundError';
import { ValidationError } from '../../../domain/shared/errors/ValidationError';
import { ForbiddenError } from '../../../domain/shared/errors/ForbiddenError';
import { ApiResponse } from '../../../utils/ApiResponse';
import { prisma } from '../../../infrastructure/persistence/prisma/PrismaClient';

export class ProductController {
  private getProductRepository(): IProductRepository {
    return container.resolve<IProductRepository>('IProductRepository');
  }

  private getReviewRepository(): IReviewRepository {
    return container.resolve<IReviewRepository>('IReviewRepository');
  }

  private getCacheService(): RedisCacheService {
    return container.resolve(RedisCacheService);
  }

  public getProducts = async (req: Request, res: Response): Promise<void> => {
    const filters = req.query;
    const cacheService = this.getCacheService();
    const cacheKey = `cache:products:list:${JSON.stringify(filters)}`;

    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      res.status(200).json(ApiResponse.success(cached, 'Products retrieved from cache'));
      return;
    }

    const repo = this.getProductRepository();
    const result = await repo.findMany(filters);

    await cacheService.set(cacheKey, result, 120); // Cache for 2 min

    res.status(200).json(ApiResponse.success(result, 'Products retrieved successfully'));
  };

  public getFeatured = async (req: Request, res: Response): Promise<void> => {
    const cacheService = this.getCacheService();
    const cacheKey = 'cache:products:featured';

    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      res.status(200).json(ApiResponse.success(cached, 'Featured products from cache'));
      return;
    }

    const repo = this.getProductRepository();
    const result = await repo.findFeatured(12);

    await cacheService.set(cacheKey, result, 600); // Cache for 10 min

    res.status(200).json(ApiResponse.success(result, 'Featured products retrieved'));
  };

  public getNewArrivals = async (req: Request, res: Response): Promise<void> => {
    const cacheService = this.getCacheService();
    const cacheKey = 'cache:products:new-arrivals';

    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      res.status(200).json(ApiResponse.success(cached, 'New arrivals from cache'));
      return;
    }

    const repo = this.getProductRepository();
    const result = await repo.findNewArrivals(12);

    await cacheService.set(cacheKey, result, 600); // Cache for 10 min

    res.status(200).json(ApiResponse.success(result, 'New arrivals retrieved'));
  };

  public getBestSellers = async (req: Request, res: Response): Promise<void> => {
    const repo = this.getProductRepository();
    const result = await repo.findBestSellers(12);
    res.status(200).json(ApiResponse.success(result, 'Best sellers retrieved'));
  };

  public getProductBySlug = async (req: Request, res: Response): Promise<void> => {
    const slug = req.params.slug;
    const repo = this.getProductRepository();
    const reviewRepo = this.getReviewRepository();

    const product = await repo.findBySlug(slug);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const productId = product.getId()!;

    // Increment views asynchronously
    repo.incrementViews(productId).catch(() => {});

    // Resolve Category Breadcrumbs
    const breadcrumbs = await this.getBreadcrumbs(product.getCategoryId());

    // Resolve Review Stats
    const reviewStats = await reviewRepo.getStatsByProductId(productId);

    // Resolve 4 Related Products
    let related: any[] = [];
    if (product.getCategoryId()) {
      related = await repo.findRelated(product.getCategoryId()!, productId, 4);
    }

    // Check if user is authenticated and check wishlist status
    let isInWishlist = false;
    if (req.user) {
      const wishlistItem = await prisma.wishlistItem.findUnique({
        where: {
          userId_productId: { userId: req.user.id, productId },
        },
      });
      isInWishlist = !!wishlistItem;
    }

    // Get live availability
    const inventory = await prisma.inventory.findUnique({
      where: { productId },
    });

    // Record analytics event
    await prisma.analyticsEvent.create({
      data: {
        eventType: 'PRODUCT_VIEWED',
        userId: req.user?.id || null,
        productId,
        categoryId: product.getCategoryId(),
        metadata: { slug },
      },
    }).catch(() => {});

    res.status(200).json(ApiResponse.success({
      product,
      inventory: inventory ? {
        quantityAvailable: inventory.quantityOnHand - inventory.quantityReserved,
        allowBackorder: inventory.allowBackorder,
      } : { quantityAvailable: 0, allowBackorder: false },
      breadcrumbs,
      reviewSummary: reviewStats,
      relatedProducts: related,
      isInWishlist,
    }, 'Product details retrieved'));
  };

  public getProductsByIds = async (req: Request, res: Response): Promise<void> => {
    const ids = req.query.ids as string[];
    
    // Fetch products
    const rawProducts = await prisma.product.findMany({
      where: {
        id: { in: ids },
        deletedAt: null,
        isActive: true,
      },
      include: {
        inventory: true,
      },
    });

    // Format output
    const items = rawProducts.map((p: any) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      unit: p.unit,
      price: p.salePrice ?? p.basePrice,
      images: p.images,
      quantityAvailable: p.inventory ? p.inventory.quantityOnHand - p.inventory.quantityReserved : 0,
      allowBackorder: p.inventory ? p.inventory.allowBackorder : false,
    }));

    res.status(200).json(ApiResponse.success(items, 'Cart product details resolved'));
  };

  public getReviews = async (req: Request, res: Response): Promise<void> => {
    const productId = req.params.id;
    const filters = req.query;

    const reviewRepo = this.getReviewRepository();
    const result = await reviewRepo.findManyByProductId(
      productId,
      Number(filters.page || 1),
      Number(filters.limit || 10),
      filters.rating ? Number(filters.rating) : undefined,
      filters.sort as any
    );

    res.status(200).json(ApiResponse.success(result, 'Reviews retrieved successfully'));
  };

  public createReview = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const productId = req.params.id;
    const { rating, title, body, images } = req.body;

    const productRepo = this.getProductRepository();
    const reviewRepo = this.getReviewRepository();

    const product = await productRepo.findById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Verify order history (User must have a DELIVERED order containing this product)
    const deliveredOrder = await prisma.order.findFirst({
      where: {
        userId,
        status: 'DELIVERED',
        items: {
          some: { productId },
        },
      },
    });

    if (!deliveredOrder) {
      throw new ForbiddenError('You can only review products you have purchased and received.');
    }

    // Ensure user has not reviewed this product for this order yet
    const alreadyReviewed = await reviewRepo.hasUserReviewedProduct(userId, productId, deliveredOrder.id);
    if (alreadyReviewed) {
      throw new ValidationError('You have already submitted a review for this purchase.');
    }

    const review = new Review({
      userId,
      productId,
      orderId: deliveredOrder.id,
      rating,
      title,
      body,
      images,
      isVerified: true,
      isApproved: false, // Pending admin moderation
    });

    const savedReview = await reviewRepo.save(review);

    res.status(201).json(ApiResponse.success(savedReview, 'Review submitted successfully. It will appear once approved by an admin.'));
  };

  private async getBreadcrumbs(categoryId: string | null): Promise<any[]> {
    if (!categoryId) return [];
    const list = [];
    let currentId: string | null = categoryId;
    while (currentId) {
      const cat = await prisma.category.findUnique({
        where: { id: currentId, deletedAt: null },
      });
      if (!cat) break;
      list.push({ id: cat.id, name: cat.name, slug: cat.slug });
      currentId = cat.parentId;
    }
    return list.reverse();
  }
}
