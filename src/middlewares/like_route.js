import express from 'express';
import LikeController from '../controllers/like_controller.js';
import { authenticateToken } from './authMiddleware.js';

const router = express.Router();
const controller = new LikeController();

router.post('/:cafe_id', authenticateToken, controller.favorCafe);

export default router;