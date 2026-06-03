export interface ProductImage {
  url: string;
  alt: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  priceModifier: number;
  attributes: Record<string, string>;
  isActive: boolean;
}

export interface ProductInventory {
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  lowStockThreshold: number;
  reorderPoint: number;
  maxCapacity: number | null;
  allowBackorder: boolean;
  lastCountedAt: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  shortDescription: string | null;
  brand: string | null;
  unit: string;
  basePrice: number; // paise
  salePrice: number | null; // paise
  costPrice: number | null; // paise
  taxRate: number;
  images: ProductImage[];
  tags: string[];
  attributes: Record<string, string>;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string | null;
  category?: Category;
  variants?: ProductVariant[];
  inventory?: ProductInventory;
  viewCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  displayOrder: number;
  isActive: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  children?: Category[];
  parent?: Category;
  productCount?: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface Review {
  id: string;
  userId: string | null;
  productId: string;
  orderId: string;
  rating: number;
  title: string | null;
  body: string | null;
  images: ProductImage[];
  isVerified: boolean;
  isApproved: boolean;
  helpfulCount: number;
  reviewerName: string;
  createdAt: string;
}

export interface ProductDetail {
  product: Product;
  inventory: {
    quantityAvailable: number;
    allowBackorder: boolean;
  };
  breadcrumbs: { id: string; name: string; slug: string }[];
  reviewSummary: ReviewSummary;
  relatedProducts: Product[];
  isInWishlist: boolean;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  brands?: string[];
  inStock?: boolean;
  rating?: number;
  tags?: string[];
  sort?: "relevance" | "price_asc" | "price_desc" | "newest" | "rating" | "popular";
  page?: number;
  limit?: number;
  search?: string;
}
