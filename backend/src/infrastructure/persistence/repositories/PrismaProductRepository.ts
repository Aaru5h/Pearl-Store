import { injectable } from 'tsyringe';
import { IProductRepository, ProductFilters, PaginatedProducts } from '../interfaces/IProductRepository';
import { Product, ProductImage } from '../../../domain/catalogue/Product';
import { Money } from '../../../domain/shared/value-objects/Money';
import { prisma } from '../prisma/PrismaClient';
import { Prisma } from '@prisma/client';

@injectable()
export class PrismaProductRepository implements IProductRepository {
  public async findById(id: string): Promise<Product | null> {
    const raw = await prisma.product.findUnique({
      where: { id, deletedAt: null },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async findBySlug(slug: string): Promise<Product | null> {
    const raw = await prisma.product.findUnique({
      where: { slug, deletedAt: null },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async findBySku(sku: string): Promise<Product | null> {
    const raw = await prisma.product.findUnique({
      where: { sku: sku.toUpperCase(), deletedAt: null },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  private async getCategoryIdsRecursively(categorySlug: string): Promise<string[]> {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (!category) return [];

    // Recursive CTE query to fetch category ID + all descendant IDs
    const result: { id: string }[] = await prisma.$queryRaw`
      WITH RECURSIVE CategoryTree AS (
        SELECT id FROM categories WHERE id = ${category.id}::uuid
        UNION ALL
        SELECT c.id FROM categories c
        INNER JOIN CategoryTree ct ON c.parent_id = ct.id
      )
      SELECT id FROM CategoryTree;
    `;
    return result.map((r) => r.id);
  }

  public async findMany(filters: ProductFilters): Promise<PaginatedProducts> {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      isActive: true,
    };

    // Category tree filter
    if (filters.category) {
      const categoryIds = await this.getCategoryIdsRecursively(filters.category);
      if (categoryIds.length > 0) {
        where.categoryId = { in: categoryIds };
      } else {
        return { items: [], total: 0, page, totalPages: 0 };
      }
    }

    if (filters.brand) {
      where.brand = { equals: filters.brand, mode: 'insensitive' };
    }

    if (filters.featured !== undefined) {
      where.isFeatured = filters.featured;
    }

    // Price filters
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      const priceFilter: Prisma.IntFilter = {};
      if (filters.minPrice !== undefined) priceFilter.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) priceFilter.lte = filters.maxPrice;
      where.basePrice = priceFilter; // Simple filter on basePrice, can map to active price logic if needed
    }

    // Stock filters
    if (filters.inStock) {
      where.inventory = {
        quantityOnHand: { gt: prisma.inventory.fields.quantityReserved },
      };
    }

    // Tags filtering
    if (filters.tags && filters.tags.length > 0) {
      where.tags = { hasEvery: filters.tags };
    }

    // Sort order mapping
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters.sort) {
      switch (filters.sort) {
        case 'price_asc':
          orderBy = { basePrice: 'asc' };
          break;
        case 'price_desc':
          orderBy = { basePrice: 'desc' };
          break;
        case 'newest':
          orderBy = { createdAt: 'desc' };
          break;
        case 'popular':
          orderBy = { viewCount: 'desc' };
          break;
        case 'rating':
          // Standard sort is newest first, can join rating average if needed
          orderBy = { createdAt: 'desc' };
          break;
      }
    }

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map((i) => this.toDomain(i)),
      total,
      page,
      totalPages,
    };
  }

  public async save(product: Product): Promise<Product> {
    const id = product.getId();
    
    // Serialise Money Value Objects back to paise/cents integers
    const data = {
      name: product.getName(),
      slug: product.getSlug(),
      description: product.getDescription(),
      shortDescription: product.getShortDescription(),
      sku: product.getSku(),
      barcode: product.getBarcode(),
      categoryId: product.getCategoryId(),
      brand: product.getBrand(),
      unit: product.getUnit(),
      basePrice: product.getBasePrice().getAmount(),
      salePrice: product.getSalePrice()?.getAmount() || null,
      costPrice: product.getCostPrice()?.getAmount() || null,
      taxRate: new Prisma.Decimal(product.getTaxRate()),
      images: JSON.stringify(product.getImages()),
      tags: product.getTags(),
      attributes: product.getAttributes(),
      isActive: product.getIsActive(),
      isFeatured: product.getIsFeatured(),
      requiresShipping: product.getRequiresShipping(),
      isDigital: product.getIsDigital(),
      viewCount: product.getViewCount(),
      metaTitle: product.getMetaTitle(),
      metaDescription: product.getMetaDescription(),
      updatedAt: new Date(),
    };

    let savedRaw;
    if (id) {
      savedRaw = await prisma.product.update({
        where: { id },
        data,
      });
    } else {
      savedRaw = await prisma.product.create({
        data: {
          ...data,
          createdAt: product.getCreatedAt(),
        },
      });
    }

    return this.toDomain(savedRaw);
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await prisma.product.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return true;
    } catch {
      return false;
    }
  }

  public async findFeatured(limit: number): Promise<Product[]> {
    const list = await prisma.product.findMany({
      where: { isFeatured: true, deletedAt: null, isActive: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return list.map((i) => this.toDomain(i));
  }

  public async findNewArrivals(limit: number): Promise<Product[]> {
    const list = await prisma.product.findMany({
      where: { deletedAt: null, isActive: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return list.map((i) => this.toDomain(i));
  }

  public async findBestSellers(limit: number): Promise<Product[]> {
    // Return top products by viewCount / sales. For now viewCount is our proxy.
    const list = await prisma.product.findMany({
      where: { deletedAt: null, isActive: true },
      take: limit,
      orderBy: { viewCount: 'desc' },
    });
    return list.map((i) => this.toDomain(i));
  }

  public async findRelated(categoryId: string, excludeProductId: string, limit: number): Promise<Product[]> {
    const list = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: excludeProductId },
        deletedAt: null,
        isActive: true,
      },
      take: limit,
      orderBy: { viewCount: 'desc' },
    });
    return list.map((i) => this.toDomain(i));
  }

  public async incrementViews(id: string): Promise<void> {
    await prisma.product.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  private toDomain(raw: any): Product {
    // Parse images JSON safely
    let images: ProductImage[] = [];
    if (raw.images) {
      try {
        images = typeof raw.images === 'string' ? JSON.parse(raw.images) : raw.images;
      } catch {
        images = [];
      }
    }

    return new Product({
      id: raw.id,
      name: raw.name,
      slug: raw.slug,
      description: raw.description,
      shortDescription: raw.shortDescription,
      sku: raw.sku,
      barcode: raw.barcode,
      categoryId: raw.categoryId,
      brand: raw.brand,
      unit: raw.unit,
      basePrice: new Money(raw.basePrice, 'INR'),
      salePrice: raw.salePrice ? new Money(raw.salePrice, 'INR') : null,
      costPrice: raw.costPrice ? new Money(raw.costPrice, 'INR') : null,
      taxRate: Number(raw.taxRate),
      images,
      tags: raw.tags,
      attributes: raw.attributes as Record<string, any>,
      isActive: raw.isActive,
      isFeatured: raw.isFeatured,
      requiresShipping: raw.requiresShipping,
      isDigital: raw.isDigital,
      viewCount: raw.viewCount,
      metaTitle: raw.metaTitle,
      metaDescription: raw.metaDescription,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
