import { handleReadCafes, readAllCafe } from '../controllers/cafe_controller.js';
import { Router } from 'express';

const router = Router();

// 모든 카페 정보 불러오기
router.get('/cafes/ids', readAllCafe);

//특정 카페의 모든 관련 정보 불러오기
router.get('/cafes/:cafe_id', handleReadCafes);

export default router;
