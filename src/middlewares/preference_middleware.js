import { handlePreferredBean, getPreferredBeanDetail, removePreferredBean } from "../controllers/preference_controller.js";
import { Router } from "express";

const router = Router();

// 사용자 선호원두 추가 API 
router.post("/users/:user_id/preferred-bean", handlePreferredBean);

// 사용자 선호원두 조회 API
router.get("/users/:user_id/preferred-bean", getPreferredBeanDetail);

// 사용자 선호원두 삭제 API
router.delete("/users/:user_id/preferred-bean/:prefered_id", removePreferredBean);

export default router;