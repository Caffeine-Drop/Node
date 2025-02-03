import express from 'express';
import * as userController from '../controllers/user_controller.js';

const router = express.Router();

// 닉네임 중복 체크 API
router.get('/nickname/check', userController.checkNicknameOverlap);

// 닉네임 생성 API
router.post('/nickname', userController.createNickname);

// 닉네임 변경 API
router.patch('/nickname', userController.changeNickname);

// 유저 정보 조회 API
router.get('/:user_id', userController.getUserInfo);

export default router;

/*
app.js에 적용시 app.use('/users', userRouter);
*/
