import { Request, Response } from 'express';
import { container } from '../../../container';
import { RedisCacheService } from '../../../infrastructure/cache/RedisCacheService';
import { IProductRepository } from '../../../infrastructure/persistence/interfaces/IProductRepository';
import { ApiResponse } from '../../../utils/ApiResponse';
import { prisma } from '../../../infrastructure/persistence/prisma/PrismaClient';
import { Money } from '../../../domain/shared/value-objects/Money';
import { Product } from '../../../domain/catalogue/Product';

export class SearchController {
  private getCacheService(): RedisCacheService {
    return container.resolve(RedisCacheService);
  }

  private getProductRepository(): IProductRepository {
    return container.resolve<IProductRepository>('IProductRepository');
  }

  public search = async (req: Request, res: Response): Promise<void> => {
    const { q, category, brand, minPrice, maxPrice, inStock, sort, page = 1, limit = 12 } = req.query;
    const queryStr = String(q || '').trim();

    if (!queryStr) {
      res.status(200).json(ApiResponse.success({ items: [], total: 0 }, 'Empty query returned no results'));
      return;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Log search event in background
    prisma.analyticsEvent.create({
      data: {
        eventType: 'SEARCH_PERFORMED',
        userId: req.user?.id || null,
        searchQuery: queryStr,
      },
    }).catch(() => {});

    // Build raw SQL Postgres Full-Text Search with ranking and dynamic filters
    const searchTerms = queryStr.split(/\s+/).filter(Boolean).join(' & ');

    // 1. Build dynamic filters for raw query
    let filterQuery = '';
    const queryParams: any[] = [searchTerms];

    if (category) {
      queryParams.push(category);
      filterQuery += ` AND c.slug = $${queryParams.length}`;
    }
    if (brand) {
      queryParams.push(brand);
      filterQuery += ` AND p.brand ILIKE $${queryParams.length}`;
    }
    if (minPrice !== undefined) {
      queryParams.push(Number(minPrice));
      filterQuery += ` AND p.base_price >= $${queryParams.length}`;
    }
    if (maxPrice !== undefined) {
      queryParams.push(Number(maxPrice));
      filterQuery += ` AND p.base_price <= $${queryParams.length}`;
    }
    if (inStock === 'true') {
      filterQuery += ` AND (i.quantity_on_hand - i.quantity_reserved) > 0`;
    }

    // 2. Sorting mapping
    let orderByClause = 'ORDER BY rank DESC';
    if (sort) {
      switch (sort) {
        case 'price_asc':
          orderByClause = 'ORDER BY p.base_price ASC';
          break;
        case 'price_desc':
          orderByClause = 'ORDER BY p.base_price DESC';
          break;
        case 'newest':
          orderByClause = 'ORDER BY p.created_at DESC';
          break;
        case 'popular':
          orderByClause = 'ORDER BY p.view_count DESC';
          break;
      }
    }

    // 3. Count query
    const countSql = `
      SELECT COUNT(DISTINCT p.id) as count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE (
        to_tsvector('english', p.name || ' ' || coalesce(p.description, '') || ' ' || coalesce(p.brand, '')) 
        @@ to_tsquery('english', $1)
      )
      AND p.deleted_at IS NULL
      AND p.is_active = true
      ${filterQuery}
    `;

    const countRes: any[] = await prisma.$queryRawUnsafe(countSql, ...queryParams);
    const total = Number(countRes[0]?.count || 0);

    // 4. Items query
    queryParams.push(limitNum, skip);
    const limitParamIndex = queryParams.length - 1;
    const skipParamIndex = queryParams.length;

    const itemsSql = `
      SELECT p.*, 
             ts_rank_cd(to_tsvector('english', p.name || ' ' || coalesce(p.description, '') || ' ' || coalesce(p.brand, '')), to_tsquery('english', $1)) as rank
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN inventory i ON p.id = i.product_id
      WHERE (
        to_tsvector('english', p.name || ' ' || coalesce(p.description, '') || ' ' || coalesce(p.brand, '')) 
        @@ to_tsquery('english', $1)
      )
      AND p.deleted_at IS NULL
      AND p.is_active = true
      ${filterQuery}
      ${orderByClause}
      LIMIT $${limitParamIndex} OFFSET $${skipParamIndex}
    `;

    const rawItems: any[] = await prisma.$queryRawUnsafe(itemsSql, ...queryParams);

    // Map raw records to Domain instances
    const items = rawItems.map((raw) => {
      let parsedImages = [];
      try {
        parsedImages = typeof raw.images === 'string' ? JSON.parse(raw.images) : raw.images;
      } catch {
        parsedImages = [];
      }
      return new Product({
        id: raw.id,
        name: raw.name,
        slug: raw.slug,
        description: raw.description,
        shortDescription: raw.short_description,
        sku: raw.sku,
        barcode: raw.barcode,
        categoryId: raw.category_id,
        brand: raw.brand,
        unit: raw.unit,
        basePrice: new Money(raw.base_price, 'INR'),
        salePrice: raw.sale_price ? new Money(raw.sale_price, 'INR') : null,
        costPrice: raw.cost_price ? new Money(raw.cost_price, 'INR') : null,
        taxRate: Number(raw.tax_rate),
        images: parsedImages,
        tags: raw.tags || [],
        attributes: raw.attributes || {},
        isActive: raw.is_active,
        isFeatured: raw.is_featured,
        requiresShipping: raw.requires_shipping,
        isDigital: raw.is_digital,
        viewCount: raw.view_count,
        metaTitle: raw.meta_title,
        metaDescription: raw.meta_description,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at,
      });
    });

    // 5. Build suggestions and facets asynchronously or query simply
    const brands = await prisma.product.findMany({
      where: { deletedAt: null, isActive: true, categoryId: items.length > 0 ? items[0].getCategoryId() : undefined },
      select: { brand: true },
      distinct: ['brand'],
      take: 10,
    });

    res.status(200).json(ApiResponse.success({
      items,
      total,
      query: queryStr,
      facets: {
        brands: brands.map((b) => b.brand).filter(Boolean),
        priceRange: { min: 0, max: 100000 }, // Statically defined or query calculated range
      },
    }, 'Search results fetched'));
  };

  public suggestions = async (req: Request, res: Response): Promise<void> => {
    const q = String(req.query.q || '').trim();

    if (q.length < 2) {
      res.status(200).json(ApiResponse.success({ suggestions: [] }, 'Query too short'));
      return;
    }

    const cacheService = this.getCacheService();
    const cacheKey = `cache:search:suggestions:${q}`;

    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      res.status(200).json(ApiResponse.success(cached, 'Suggestions from cache'));
      return;
    }

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { name: { startsWith: q, mode: 'insensitive' }, deletedAt: null, isActive: true },
        select: { id: true, name: true, slug: true, images: true },
        take: 5,
      }),
      prisma.category.findMany({
        where: { name: { startsWith: q, mode: 'insensitive' }, deletedAt: null, isActive: true },
        select: { id: true, name: true, slug: true, imageUrl: true },
        take: 3,
      }),
    ]);

    const suggestions = [
      ...products.map((p) => {
        let imgUrl = null;
        try {
          const imgs = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
          imgUrl = imgs[0]?.url || null;
        } catch {}
        return {
          type: 'product',
          id: p.id,
          name: p.name,
          slug: p.slug,
          image: imgUrl,
        };
      }),
      ...categories.map((c) => ({
        type: 'category',
        id: c.id,
        name: c.name,
        slug: c.slug,
        image: c.imageUrl,
      })),
    ];

    const result = { suggestions };
    await cacheService.set(cacheKey, result, 300); // 5 min cache

    res.status(200).json(ApiResponse.success(result, 'Search suggestions resolved'));
  };

  public trending = async (req: Request, res: Response): Promise<void> => {
    const cacheService = this.getCacheService();
    const cacheKey = 'cache:search:trending';

    const cached = await cacheService.get<any>(cacheKey);
    if (cached) {
      res.status(200).json(ApiResponse.success(cached, 'Trending searches from cache'));
      return;
    }

    // Aggregate the top queries from the last 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const trendingList = await prisma.analyticsEvent.groupBy({
      by: ['searchQuery'],
      where: {
        eventType: 'SEARCH_PERFORMED',
        createdAt: { gte: oneDayAgo },
        searchQuery: { not: null },
      },
      _count: {
        searchQuery: true,
      },
      orderBy: {
        _count: {
          searchQuery: 'desc',
        },
      },
      take: 10,
    });

    const queries = trendingList.map((item) => item.searchQuery).filter(Boolean);
    const result = { queries };

    await cacheService.set(cacheKey, result, 3600); // 1 hour cache

    res.status(200).json(ApiResponse.success(result, 'Trending searches resolved'));
  };
}
