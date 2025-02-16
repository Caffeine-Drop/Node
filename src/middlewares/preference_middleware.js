import { handlePreferredBean, getPreferredBeanDetail, removePreferredBean } from "../controllers/preference_controller.js";
import { Router } from "express";
import { authenticateToken } from './authMiddleware.js';

const router = Router();

// 사용자 선호원두 추가 API 
router.post("/users/preferred-bean", authenticateToken, handlePreferredBean);

// 사용자 선호원두 조회 API
router.get("/users/preferred-bean", authenticateToken, getPreferredBeanDetail);

// 사용자 선호원두 삭제 API
router.delete("/users/preferred-bean/:prefered_id", authenticateToken, removePreferredBean);

export default router;