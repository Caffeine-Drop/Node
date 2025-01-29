import { getBeanDetail } from "../controllers/bean_controller.js";
import { Router } from "express";

const router = Router();

// 원두 상세조회 API 
router.get("/beans/:bean_id", getBeanDetail);


export default router;