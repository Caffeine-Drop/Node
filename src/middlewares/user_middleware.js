import { handlePreferredBean } from "../controllers/user_controller.js";
import { Router } from "express";

const router = Router();

// 사용자 선호원두 추가 API 
router.post("/users/:user_id/preferred-bean", handlePreferredBean);

export default router;