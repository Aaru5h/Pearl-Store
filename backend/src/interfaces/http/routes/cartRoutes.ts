import { Router } from 'express';
import { CartController } from '../controllers/CartController';
import { authenticate } from '../middleware/authenticate';
import { validateBody } from '../middleware/validateBody';
import { asyncHandler } from '../../../utils/asyncHandler';
import {
  addToCartSchema,
  updateCartItemSchema,
  applyCouponSchema,
} from '../schemas/cart.schemas.ts';

const router = Router();
const controller = new CartController();

// Optional Auth (Supports both guests and logged-in customers)
const optionalAuthenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

router.get('/', optionalAuthenticate, asyncHandler(controller.getCart));
router.post('/items', optionalAuthenticate, validateBody(addToCartSchema), asyncHandler(controller.addItem));
router.put('/items/:itemId', optionalAuthenticate, validateBody(updateCartItemSchema), asyncHandler(controller.updateItem));
router.delete('/items/:itemId', optionalAuthenticate, asyncHandler(controller.removeItem));
router.post('/apply-coupon', optionalAuthenticate, validateBody(applyCouponSchema), asyncHandler(controller.applyCoupon));
router.delete('/coupon', optionalAuthenticate, asyncHandler(controller.removeCoupon));

// Explicit auth required for merging carts on login
router.post('/merge', authenticate, asyncHandler(controller.merge));

export { router as cartRoutes };
export default router;
