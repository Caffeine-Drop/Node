import express from 'express';
import passport from 'passport';

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

export default router;

/*
app.js에 적용시 app.use('/oauth2', authRouter);
*/