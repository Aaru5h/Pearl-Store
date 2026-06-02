import { injectable } from 'tsyringe';
import { IReviewRepository, ReviewStats } from '../interfaces/IReviewRepository';
import { Review } from '../../../domain/catalogue/Review';
import { prisma } from '../prisma/PrismaClient';
import { Prisma } from '@prisma/client';

@injectable()
export class PrismaReviewRepository implements IReviewRepository {
  public async findById(id: string): Promise<Review | null> {
    const raw = await prisma.review.findUnique({
      where: { id, deletedAt: null },
    });
    if (!raw) return null;
    return this.toDomain(raw);
  }

  public async findManyByProductId(
    productId: string,
    page: number,
    limit: number,
    rating?: number,
    sort?: 'newest' | 'rating_high' | 'rating_low' | 'helpful'
  ): Promise<{ items: Review[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.ReviewWhereInput = {
      productId,
      deletedAt: null,
      isApproved: true, // Only show approved reviews by default
    };

    if (rating !== undefined) {
      where.rating = rating;
    }

    let orderBy: Prisma.ReviewOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort) {
      switch (sort) {
        case 'newest':
          orderBy = { createdAt: 'desc' };
          break;
        case 'rating_high':
          orderBy = { rating: 'desc' };
          break;
        case 'rating_low':
          orderBy = { rating: 'asc' };
          break;
        case 'helpful':
          orderBy = { helpfulCount: 'desc' };
          break;
      }
    }

    const [items, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.review.count({ where }),
    ]);

    return {
      items: items.map((r) => this.toDomain(r)),
      total,
    };
  }

  public async save(review: Review): Promise<Review> {
    const id = review.getId();
    const data = {
      userId: review.getUserId(),
      productId: review.getProductId(),
      orderId: review.getOrderId(),
      rating: review.getRating(),
      title: review.getTitle(),
      body: review.getBody(),
      images: JSON.stringify(review.getImages()),
      isVerified: review.getIsVerified(),
      isApproved: review.getIsApproved(),
      helpfulCount: review.getHelpfulCount(),
      reportedCount: review.getReportedCount(),
      updatedAt: new Date(),
    };

    let savedRaw;
    if (id) {
      savedRaw = await prisma.review.update({
        where: { id },
        data,
      });
    } else {
      savedRaw = await prisma.review.create({
        data: {
          ...data,
          createdAt: review.getCreatedAt(),
        },
      });
    }

    return this.toDomain(savedRaw);
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await prisma.review.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return true;
    } catch {
      return false;
    }
  }

  public async getStatsByProductId(productId: string): Promise<ReviewStats> {
    const aggregations = await prisma.review.aggregate({
      where: { productId, deletedAt: null, isApproved: true },
      _avg: { rating: true },
      _count: { rating: true },
    });

    const starCounts = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId, deletedAt: null, isApproved: true },
      _count: { rating: true },
    });

    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    starCounts.forEach((item) => {
      ratingDistribution[item.rating] = item._count.rating;
    });

    return {
      averageRating: aggregations._avg.rating ? Number(aggregations._avg.rating.toFixed(2)) : 0,
      totalReviews: aggregations._count.rating,
      ratingDistribution,
    };
  }

  public async hasUserReviewedProduct(userId: string, productId: string, orderId: string): Promise<boolean> {
    const count = await prisma.review.count({
      where: { userId, productId, orderId, deletedAt: null },
    });
    return count > 0;
  }

  private toDomain(raw: any): Review {
    let images: string[] = [];
    if (raw.images) {
      try {
        images = typeof raw.images === 'string' ? JSON.parse(raw.images) : raw.images;
      } catch {
        images = [];
      }
    }

    return new Review({
      id: raw.id,
      userId: raw.userId,
      productId: raw.productId,
      orderId: raw.orderId,
      rating: raw.rating,
      title: raw.title,
      body: raw.body,
      images,
      isVerified: raw.isVerified,
      isApproved: raw.isApproved,
      helpfulCount: raw.helpfulCount,
      reportedCount: raw.reportedCount,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
