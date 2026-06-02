import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateBody } from '../middleware/validateBody';
import { asyncHandler } from '../../../utils/asyncHandler';
import { rateLimiter } from '../middleware/rateLimiter';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/auth.schemas.ts';

const router = Router();
const controller = new AuthController();

// Rate Limiters
const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10,
  message: 'Too many authentication attempts. Please try again after 15 minutes.',
});

const resetLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 60 mins
  max: 3,
  message: 'Too many request attempts. Please try again after an hour.',
});

router.post('/register', authLimiter, validateBody(registerSchema), asyncHandler(controller.register));
router.post('/login', authLimiter, validateBody(loginSchema), asyncHandler(controller.login));
router.post('/verify-email', validateBody(verifyEmailSchema), asyncHandler(controller.verifyEmail));
router.post('/forgot-password', resetLimiter, validateBody(forgotPasswordSchema), asyncHandler(controller.forgotPassword));
router.post('/reset-password', resetLimiter, validateBody(resetPasswordSchema), asyncHandler(controller.resetPassword));
router.post('/refresh', asyncHandler(controller.refresh));
router.post('/logout', asyncHandler(controller.logout));

export { router as authRoutes };
export default router;
