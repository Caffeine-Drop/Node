import { handleFilterCafe } from '../controllers/filter_controller.js';
import { Router } from 'express';

const router = Router();

//카페 필터링(영업시간이 기본)
router.get('/cafes/filter', handleFilterCafe);

export default router;
