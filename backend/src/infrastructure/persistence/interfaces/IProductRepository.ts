import { Product } from '../../../domain/catalogue/Product';

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tags?: string[];
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'rating';
  featured?: boolean;
}

export interface PaginatedProducts {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findMany(filters: ProductFilters): Promise<PaginatedProducts>;
  save(product: Product): Promise<Product>;
  delete(id: string): Promise<boolean>;
  findFeatured(limit: number): Promise<Product[]>;
  findNewArrivals(limit: number): Promise<Product[]>;
  findBestSellers(limit: number): Promise<Product[]>;
  findRelated(categoryId: string, excludeProductId: string, limit: number): Promise<Product[]>;
  incrementViews(id: string): Promise<void>;
}
