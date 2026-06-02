import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { asyncHandler } from '../../../utils/asyncHandler';

const router = Router();
const controller = new CategoryController();

router.get('/', asyncHandler(controller.getCategoriesTree));
router.get('/:slug', asyncHandler(controller.getCategoryBySlug));

export { router as categoryRoutes };
export default router;
