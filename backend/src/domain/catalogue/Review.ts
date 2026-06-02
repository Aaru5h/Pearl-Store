import { ValidationError } from '../shared/errors/ValidationError';

export interface ReviewProps {
  id?: string;
  userId?: string | null;
  productId: string;
  orderId: string;
  rating: number; // 1-5
  title?: string | null;
  body?: string | null;
  images?: string[];
  isVerified?: boolean;
  isApproved?: boolean;
  helpfulCount?: number;
  reportedCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Review {
  private readonly id?: string;
  private readonly userId: string | null;
  private readonly productId: string;
  private readonly orderId: string;
  private rating: number;
  private title: string | null;
  private body: string | null;
  private images: string[];
  private readonly isVerified: boolean;
  private isApproved: boolean;
  private helpfulCount: number;
  private reportedCount: number;
  private readonly createdAt: Date;
  private updatedAt: Date;

  constructor(props: ReviewProps) {
    this.validate(props);
    this.id = props.id;
    this.userId = props.userId ?? null;
    this.productId = props.productId;
    this.orderId = props.orderId;
    this.rating = props.rating;
    this.title = props.title ?? null;
    this.body = props.body ?? null;
    this.images = props.images ?? [];
    this.isVerified = props.isVerified ?? false;
    this.isApproved = props.isApproved ?? false;
    this.helpfulCount = props.helpfulCount ?? 0;
    this.reportedCount = props.reportedCount ?? 0;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  private validate(props: ReviewProps): void {
    if (!props.productId) {
      throw new ValidationError('Product ID is required for reviews');
    }
    if (!props.orderId) {
      throw new ValidationError('Order ID is required for reviews');
    }
    if (!Number.isInteger(props.rating) || props.rating < 1 || props.rating > 5) {
      throw new ValidationError('Rating must be an integer between 1 and 5');
    }
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getUserId(): string | null {
    return this.userId;
  }

  public getProductId(): string {
    return this.productId;
  }

  public getOrderId(): string {
    return this.orderId;
  }

  public getRating(): number {
    return this.rating;
  }

  public getTitle(): string | null {
    return this.title;
  }

  public getBody(): string | null {
    return this.body;
  }

  public getImages(): string[] {
    return this.images;
  }

  public getIsVerified(): boolean {
    return this.isVerified;
  }

  public getIsApproved(): boolean {
    return this.isApproved;
  }

  public getHelpfulCount(): number {
    return this.helpfulCount;
  }

  public getReportedCount(): number {
    return this.reportedCount;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Actions
  public approve(): void {
    this.isApproved = true;
    this.updatedAt = new Date();
  }

  public disapprove(): void {
    this.isApproved = false;
    this.updatedAt = new Date();
  }

  public upvoteHelpful(): void {
    this.helpfulCount += 1;
    this.updatedAt = new Date();
  }

  public report(): void {
    this.reportedCount += 1;
    this.updatedAt = new Date();
  }
}
