import express from "express";
import { getRating } from "../controllers/review_query_controller.js";
import { createReviewController } from "../controllers/review_registration_controller.js";

const router = express.Router();

// 카페 전체 평점 반환
router.get("/reviews/:cafe_id/ratings", getRating);
// 리뷰 등록 엔드포인트
router.post("/reviews/:cafeId", createReviewController);

export default router;