import { z } from 'zod';

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(12),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().int().nonnegative().optional(),
  maxPrice: z.coerce.number().int().nonnegative().optional(),
  inStock: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  tags: z
    .string()
    .transform((val) => val.split(',').map((t) => t.trim()))
    .optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'popular', 'rating']).default('newest'),
  featured: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
});

export const productIdsQuerySchema = z.object({
  ids: z
    .string()
    .transform((val) => val.split(',').map((id) => id.trim()))
    .pipe(z.array(z.string().uuid('Invalid UUID in product IDs'))),
});

export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  body: z.string().max(1000).optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
});

export const reviewQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  sort: z.enum(['newest', 'rating_high', 'rating_low', 'helpful']).default('newest'),
});
