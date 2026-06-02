import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authenticate } from '../middleware/authenticate';
import { requireEmailVerified } from '../middleware/requireEmailVerified';
import { validateBody } from '../middleware/validateBody';
import { validateQuery } from '../middleware/validateQuery';
import { asyncHandler } from '../../../utils/asyncHandler';
import {
  productQuerySchema,
  productIdsQuerySchema,
  createReviewSchema,
  reviewQuerySchema,
} from '../schemas/product.schemas.ts';

const router = Router();
const controller = new ProductController();

// Anonymous access routes
router.get('/', validateQuery(productQuerySchema), asyncHandler(controller.getProducts));
router.get('/featured', asyncHandler(controller.getFeatured));
router.get('/new-arrivals', asyncHandler(controller.getNewArrivals));
router.get('/best-sellers', asyncHandler(controller.getBestSellers));
router.get('/by-ids', validateQuery(productIdsQuerySchema), asyncHandler(controller.getProductsByIds));
router.get('/:slug', asyncHandler(controller.getProductBySlug));
router.get('/:id/reviews', validateQuery(reviewQuerySchema), asyncHandler(controller.getReviews));

// Authenticated reviews submission
router.post('/:id/reviews', authenticate, requireEmailVerified, validateBody(createReviewSchema), asyncHandler(controller.createReview));

export { router as productRoutes };
export default router;
