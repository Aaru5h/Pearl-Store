import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate } from '../middleware/authenticate';
import { requireEmailVerified } from '../middleware/requireEmailVerified';
import { validateBody } from '../middleware/validateBody';
import { asyncHandler } from '../../../utils/asyncHandler';
import {
  updateProfileSchema,
  updateEmailSchema,
  updatePasswordSchema,
  deleteUserSchema,
  createAddressSchema,
} from '../schemas/user.schemas.ts';

const router = Router();
const controller = new UserController();

// All userRoutes require authentication
router.use(authenticate);

// Profile
router.get('/me', asyncHandler(controller.getMe));
router.put('/me', validateBody(updateProfileSchema), asyncHandler(controller.updateMe));
router.put('/me/email', validateBody(updateEmailSchema), asyncHandler(controller.updateEmail));
router.put('/me/password', validateBody(updatePasswordSchema), asyncHandler(controller.updatePassword));
router.delete('/me', validateBody(deleteUserSchema), asyncHandler(controller.deleteMe));

// Addresses
router.get('/me/addresses', asyncHandler(controller.getAddresses));
router.post('/me/addresses', requireEmailVerified, validateBody(createAddressSchema), asyncHandler(controller.createAddress));
router.put('/me/addresses/:id', requireEmailVerified, validateBody(createAddressSchema), asyncHandler(controller.updateAddress));
router.delete('/me/addresses/:id', requireEmailVerified, asyncHandler(controller.deleteAddress));
router.patch('/me/addresses/:id/set-default', requireEmailVerified, asyncHandler(controller.setDefaultAddress));

export { router as userRoutes };
export default router;
