import express from "express";
import multer from "multer";
import * as userController from "../controllers/user_controller.js";
import { authenticateToken } from './authMiddleware.js';

const router = express.Router();

// 닉네임 중복 체크 API
router.get("/nickname/check", userController.checkNicknameOverlap);

// 닉네임 생성 API
router.post("/nickname", authenticateToken, userController.createNickname);

// 닉네임 변경 API
router.patch("/nickname", authenticateToken, userController.changeNickname);

// 유저 정보 조회 API
router.get("", authenticateToken, userController.getUserInfo);

// Multer 설정 (메모리에 저장)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 프로필 이미지 등록 및 변경 API
router.patch("/profile-image", authenticateToken, upload.single("file"), userController.uploadProfileImage);

export default router;

/*
app.js에 적용시 app.use('/users', userRouter);
*/
