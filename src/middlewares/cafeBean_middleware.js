import { handleCafeBean, getCafeBeansDetails, hasSpecialTea } from "../controllers/cafeBean_controller.js";
import { Router } from "express";

const router = Router();

//카페 보유원두 전체 상세조회 API
router.get("/cafes/:cafe_id/beans", getCafeBeansDetails);

// 카페 스페셜티 인증여부 조회 API
router.get("/cafes/:cafe_id/specialty", hasSpecialTea);

// 카페 보유원두 추가 API
router.post("/cafes/:cafe_id/beans/:bean_id", handleCafeBean);

export default router;