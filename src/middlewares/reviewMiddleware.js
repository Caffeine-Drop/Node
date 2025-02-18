import express from "express";
import { getRating, getReviews } from "../controllers/review_query_controller.js";
import { authenticateToken } from './authMiddleware.js';
import { createReviewController } from '../controllers/review_registration_controller.js';

const router = express.Router();

// 카페 전체 평점 반환
router.get("/:cafe_id/ratings", getRating);

// 카페별 리뷰 전체 반환
router.get("/:cafeId", authenticateToken, getReviews);

// 카페 리뷰 등록
router.post("/:cafeId", authenticateToken, createReviewController);

export default router;