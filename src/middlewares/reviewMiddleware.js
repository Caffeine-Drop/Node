import express from "express";
import { getRating } from "../controllers/review_query_controller.js";
import { createReviewController } from "../controllers/review_registration_controller.js"

const router = express.Router();

// 카페 전체 평점 반환
router.get("/reviews/:cafe_id/ratings", getRating);

// 카페 리뷰 등록 평점
router.post("/reviews/:cafe_id", createReviewController)

export default router;