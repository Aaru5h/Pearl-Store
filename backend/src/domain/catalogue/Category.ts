import { ValidationError } from '../shared/errors/ValidationError';

export interface CategoryProps {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  parentId?: string | null;
  displayOrder?: number;
  isActive?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Category {
  private readonly id?: string;
  private name: string;
  private slug: string;
  private description: string | null;
  private imageUrl: string | null;
  private parentId: string | null;
  private displayOrder: number;
  private isActive: boolean;
  private metaTitle: string | null;
  private metaDescription: string | null;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: CategoryProps) {
    this.validate(props);
    this.id = props.id;
    this.name = props.name.trim();
    this.slug = props.slug.trim().toLowerCase();
    this.description = props.description ?? null;
    this.imageUrl = props.imageUrl ?? null;
    this.parentId = props.parentId ?? null;
    this.displayOrder = props.displayOrder ?? 0;
    this.isActive = props.isActive ?? true;
    this.metaTitle = props.metaTitle ?? null;
    this.metaDescription = props.metaDescription ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: CategoryProps): void {
    if (!props.name || props.name.trim().length === 0) {
      throw new ValidationError('Category name is required');
    }
    if (!props.slug || props.slug.trim().length === 0) {
      throw new ValidationError('Category slug is required');
    }
  }

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

  public getImageUrl(): string | null {
    return this.imageUrl;
  }

  public getParentId(): string | null {
    return this.parentId;
  }

  public getDisplayOrder(): number {
    return this.displayOrder;
  }

  public getIsActive(): boolean {
    return this.isActive;
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

  // Update methods
  public updateDetails(props: Partial<Omit<CategoryProps, 'id' | 'createdAt' | 'updatedAt'>>): void {
    if (props.name !== undefined) {
      if (props.name.trim().length === 0) throw new ValidationError('Category name cannot be empty');
      this.name = props.name.trim();
    }
    if (props.slug !== undefined) {
      if (props.slug.trim().length === 0) throw new ValidationError('Category slug cannot be empty');
      this.slug = props.slug.trim().toLowerCase();
    }
    if (props.description !== undefined) this.description = props.description;
    if (props.imageUrl !== undefined) this.imageUrl = props.imageUrl;
    if (props.parentId !== undefined) this.parentId = props.parentId;
    if (props.displayOrder !== undefined) this.displayOrder = props.displayOrder;
    if (props.isActive !== undefined) this.isActive = props.isActive;
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
