import express from "express";
import { getRating } from "../controllers/review_query_controller.js";

const router = express.Router();

// 카페 전체 평점 반환
router.get("/reviews/:cafe_id/ratings", getRating);

export default router;