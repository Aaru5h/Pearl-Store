import { Router } from 'express';
import { SearchController } from '../controllers/SearchController';
import { asyncHandler } from '../../../utils/asyncHandler';

const router = Router();
const controller = new SearchController();

router.get('/', asyncHandler(controller.search));
router.get('/suggestions', asyncHandler(controller.suggestions));
router.get('/trending', asyncHandler(controller.trending));

export { router as searchRoutes };
export default router;
