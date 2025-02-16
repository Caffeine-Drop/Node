import { handleSortCafes } from '../controllers/sort_controller.js';
import { Router } from 'express';

const router = Router();

//카페 정렬(인기순이 기본)
router.get('/cafes', handleSortCafes);

export default router;
