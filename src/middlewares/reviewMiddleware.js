import express from "express";
import { getRating, getReviews } from "../controllers/review_query_controller.js";
import { authenticateToken } from './authMiddleware.js';
import { createReviewController } from '../controllers/review_registration_controller.js';
import multer from "multer";

const router = express.Router();

// 카페 전체 평점 반환
router.get("/:cafe_id/ratings", getRating);

// Multer 설정 (메모리 저장소 사용)
const upload = multer({ storage: multer.memoryStorage() });
// 리뷰 이미지 업로드 미들웨어 (최대 6장)
const uploadReviewImages = upload.array("images", 6);

// 카페 리뷰 등록
router.post("/:cafeId", authenticateToken, uploadReviewImages, createReviewController);

// 카페별 리뷰 전체 반환
router.get("/:cafeId", getReviews);

export default router;