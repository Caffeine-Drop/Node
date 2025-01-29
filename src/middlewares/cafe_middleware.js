import { handleCafeBean, getCafeBeans, getCafeBeansDetails, hasSpecialTea } from "../controllers/cafe_controller.js";
import { Router } from "express";

const router = Router();

/**
 * GET
 */
// 카페 보유원두 이름 조회 API
router.get("/cafes/:cafe_id/beans", getCafeBeans);

//카페 보유원두 전체 상세조회 API
router.get("/cafes/:cafe_id/beans/details", getCafeBeansDetails);

// 카페 스페셜티 인증여부 조회 API
router.get("/cafes/:cafe_id/specialty", hasSpecialTea);


/**
 * POST
 */
// 카페 보유원두 추가 API
router.post("/cafes/:cafe_id/beans/:bean_id", handleCafeBean);


export default router;