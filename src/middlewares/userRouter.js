import express from "express";
import upload from '../multerConfig.js';
import * as userController from "../controllers/user_controller.js";

const router = express.Router();

// 닉네임 중복 체크 API
router.get("/nickname/check/:user_id", userController.checkNicknameOverlap);

// 닉네임 생성 API
router.post("/nickname", userController.createNickname);

// 닉네임 변경 API
router.patch("/nickname", userController.changeNickname);

// 유저 정보 조회 API
router.get("/:user_id", userController.getUserInfo);

// 프로필 이미지 등록 및 변경 API
router.post(
    '/profile-image', 
    (req, res, next) => {
      req.dir = 'profile-images';  // req.dir 설정 미들웨어 (S3에 저장할 폴더 지정)
    next();
    },
    upload.single('profile-image'),
    userController.uploadProfileImage
  );

export default router;

/*
app.js에 적용시 app.use('/users', userRouter);
*/
