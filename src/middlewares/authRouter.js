import { naverLoginController, kakaoLoginController, logout } from '../controllers/auth_controller.js';
import express from 'express';

const router = express.Router();

// 네이버 로그인 라우팅
router.post('/login/naver', naverLoginController);

// 프론트엔드가 카카오 인증 후 받은 코드를 전송하면 컨트롤러가 코드와 토큰을 교환하고 DB처리 후 응답해주기 위한 라우팅
// 카카오 로그인 라우팅
router.post('/login/kakao', kakaoLoginController);

// 로그아웃 라우팅
router.post('/logout', logout);

export default router;

/*
app.js에 적용시 app.use('/oauth2', authRouter);
*/
