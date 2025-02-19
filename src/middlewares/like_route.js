import express from "express";
import LikeController from "../controllers/like_controller.js";
import { authenticateToken } from "./authMiddleware.js";

const router = express.Router();
const controller = new LikeController();

// 카페에 좋아요 하기
router.post("/:cafe_id", authenticateToken, controller.favorCafe);

// 나의 좋아요 카페 반환
router.get("/", authenticateToken, controller.myCafe)

export default router;
    