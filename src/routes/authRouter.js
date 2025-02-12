import express from 'express';
import passport from 'passport';
import { kakaoLogout, naverLogout } from '../auth.js'; // 로그아웃 함수 import


const router = express.Router();

// OAuth 로그인 라우팅 (네이버)
router.get("/login/naver", passport.authenticate("naver"));
router.get("/callback/naver", passport.authenticate("naver", {
  failureRedirect: "/oauth2/login/naver",
  failureMessage: true,
}), (req, res) => { 
  const { accessToken, refreshToken } = req.user;
  res.success({accessToken, refreshToken});
});

// OAuth 로그인 라우팅 (카카오)
router.get("/login/kakao", passport.authenticate("kakao"));
router.get("/callback/kakao", passport.authenticate("kakao", {
  failureRedirect: "/oauth2/login/kakao",
  failureMessage: true,
}), (req, res) => {
  const { accessToken, refreshToken } = req.user;
  res.success({accessToken, refreshToken});
});

// 로그아웃 라우팅
router.get("/logout", async (req, res) => {
  try {
    if (req.user) {
      const { kakaoAccessToken, naverAccessToken } = req.user;

      // 카카오 로그아웃 처리
      if (kakaoAccessToken) {
        await kakaoLogout(kakaoAccessToken);
      }

      // 네이버 로그아웃 처리
      if (naverAccessToken) {
        await naverLogout(naverAccessToken);
      }
    }

    // 세션 종료
    req.logout((err) => {
      if (err) {
        return res.error(error, 500);
      }
      res.clearCookie('connect.sid');  // 세션 쿠키 삭제
      res.success({ message: "로그아웃 완료" }, 200);
    });
  } catch (error) {
    res.error(error, 500);
  }
});

export default router;

/*
app.js에 적용시 app.use('/oauth2', authRouter);
*/