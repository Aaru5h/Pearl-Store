import { Money } from '../shared/value-objects/Money';
import { ValidationError } from '../shared/errors/ValidationError';

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface ProductProps {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  sku: string;
  barcode?: string | null;
  categoryId?: string | null;
  brand?: string | null;
  unit: string;
  basePrice: Money;
  salePrice?: Money | null;
  costPrice?: Money | null;
  taxRate?: number; // E.g., 18.00 representing 18%
  images?: ProductImage[];
  tags?: string[];
  attributes?: Record<string, any>;
  isActive?: boolean;
  isFeatured?: boolean;
  requiresShipping?: boolean;
  isDigital?: boolean;
  viewCount?: number;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Product {
  private readonly id?: string;
  private name: string;
  private slug: string;
  private description: string | null;
  private shortDescription: string | null;
  private sku: string;
  private barcode: string | null;
  private categoryId: string | null;
  private brand: string | null;
  private unit: string;
  private basePrice: Money;
  private salePrice: Money | null;
  private costPrice: Money | null;
  private taxRate: number;
  private images: ProductImage[];
  private tags: string[];
  private attributes: Record<string, any>;
  private isActive: boolean;
  private isFeatured: boolean;
  private requiresShipping: boolean;
  private isDigital: boolean;
  private viewCount: number;
  private metaTitle: string | null;
  private metaDescription: string | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: ProductProps) {
    this.validate(props);
    this.id = props.id;
    this.name = props.name.trim();
    this.slug = props.slug.trim().toLowerCase();
    this.description = props.description ?? null;
    this.shortDescription = props.shortDescription ?? null;
    this.sku = props.sku.trim().toUpperCase();
    this.barcode = props.barcode ?? null;
    this.categoryId = props.categoryId ?? null;
    this.brand = props.brand ?? null;
    this.unit = props.unit.trim();
    this.basePrice = props.basePrice;
    this.salePrice = props.salePrice ?? null;
    this.costPrice = props.costPrice ?? null;
    this.taxRate = props.taxRate ?? 0;
    this.images = props.images ?? [];
    this.tags = props.tags ?? [];
    this.attributes = props.attributes ?? {};
    this.isActive = props.isActive ?? true;
    this.isFeatured = props.isFeatured ?? false;
    this.requiresShipping = props.requiresShipping ?? true;
    this.isDigital = props.isDigital ?? false;
    this.viewCount = props.viewCount ?? 0;
    this.metaTitle = props.metaTitle ?? null;
    this.metaDescription = props.metaDescription ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: ProductProps): void {
    if (!props.name || props.name.trim().length === 0) {
      throw new ValidationError('Product name is required');
    }
    if (!props.slug || props.slug.trim().length === 0) {
      throw new ValidationError('Product slug is required');
    }
    if (!props.sku || props.sku.trim().length === 0) {
      throw new ValidationError('Product SKU is required');
    }
    if (!props.unit || props.unit.trim().length === 0) {
      throw new ValidationError('Product unit is required');
    }
    if (props.taxRate !== undefined && props.taxRate < 0) {
      throw new ValidationError('Tax rate cannot be negative');
    }
  }

  // Getters
  public getId(): string | undefined {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getSlug(): string {
    return this.slug;
  }

  public getDescription(): string | null {
    return this.description;
  }

  public getShortDescription(): string | null {
    return this.shortDescription;
  }

  public getSku(): string {
    return this.sku;
  }

  public getBarcode(): string | null {
    return this.barcode;
  }

  public getCategoryId(): string | null {
    return this.categoryId;
  }

  public getBrand(): string | null {
    return this.brand;
  }

  public getUnit(): string {
    return this.unit;
  }

  public getBasePrice(): Money {
    return this.basePrice;
  }

  public getSalePrice(): Money | null {
    return this.salePrice;
  }

  public getCostPrice(): Money | null {
    return this.costPrice;
  }

  public getTaxRate(): number {
    return this.taxRate;
  }

  public getImages(): ProductImage[] {
    return this.images;
  }

  public getTags(): string[] {
    return this.tags;
  }

  public getAttributes(): Record<string, any> {
    return this.attributes;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public getIsFeatured(): boolean {
    return this.isFeatured;
  }

  public getRequiresShipping(): boolean {
    return this.requiresShipping;
  }

  public getIsDigital(): boolean {
    return this.isDigital;
  }

  public getViewCount(): number {
    return this.viewCount;
  }

  public getMetaTitle(): string | null {
    return this.metaTitle;
  }

  public getMetaDescription(): string | null {
    return this.metaDescription;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Domain Actions
  public getPrice(): Money {
    if (this.salePrice) {
      return this.salePrice;
    }
    return this.basePrice;
  }

  public incrementViews(): void {
    this.viewCount += 1;
    this.updatedAt = new Date();
  }

  public updatePrice(base: Money, sale?: Money | null, cost?: Money | null): void {
    this.basePrice = base;
    this.salePrice = sale ?? null;
    this.costPrice = cost ?? null;
    this.updatedAt = new Date();
  }

  public updateDetails(props: Partial<Omit<ProductProps, 'id' | 'basePrice' | 'salePrice' | 'costPrice' | 'viewCount' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (props.name.trim().length === 0) throw new ValidationError('Product name cannot be empty');
      this.name = props.name.trim();
    }
    if (props.slug !== undefined) {
      if (props.slug.trim().length === 0) throw new ValidationError('Product slug cannot be empty');
      this.slug = props.slug.trim().toLowerCase();
    }
    if (props.sku !== undefined) {
      if (props.sku.trim().length === 0) throw new ValidationError('Product SKU cannot be empty');
      this.sku = props.sku.trim().toUpperCase();
    }
    if (props.description !== undefined) this.description = props.description;
    if (props.shortDescription !== undefined) this.shortDescription = props.shortDescription;
    if (props.barcode !== undefined) this.barcode = props.barcode;
    if (props.categoryId !== undefined) this.categoryId = props.categoryId;
    if (props.brand !== undefined) this.brand = props.brand;
    if (props.unit !== undefined) this.unit = props.unit.trim();
    if (props.taxRate !== undefined) {
      if (props.taxRate < 0) throw new ValidationError('Tax rate cannot be negative');
      this.taxRate = props.taxRate;
    }
    if (props.images !== undefined) this.images = props.images;
    if (props.tags !== undefined) this.tags = props.tags;
    if (props.attributes !== undefined) this.attributes = props.attributes;
    if (props.isActive !== undefined) this.isActive = props.isActive;
    if (props.isFeatured !== undefined) this.isFeatured = props.isFeatured;
    if (props.requiresShipping !== undefined) this.requiresShipping = props.requiresShipping;
    if (props.isDigital !== undefined) this.isDigital = props.isDigital;
    if (props.metaTitle !== undefined) this.metaTitle = props.metaTitle;
    if (props.metaDescription !== undefined) this.metaDescription = props.metaDescription;
    this.updatedAt = new Date();
  }

  public deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  public activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }
}
