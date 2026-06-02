import { Review } from '../../../domain/catalogue/Review';

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>; // { 1: count, 2: count... }
}

export interface IReviewRepository {
  findById(id: string): Promise<Review | null>;
  findManyByProductId(
    productId: string,
    page: number,
    limit: number,
    rating?: number,
    sort?: 'newest' | 'rating_high' | 'rating_low' | 'helpful'
  ): Promise<{ items: Review[]; total: number }>;
  save(review: Review): Promise<Review>;
  delete(id: string): Promise<boolean>;
  getStatsByProductId(productId: string): Promise<ReviewStats>;
  hasUserReviewedProduct(userId: string, productId: string, orderId: string): Promise<boolean>;
}
