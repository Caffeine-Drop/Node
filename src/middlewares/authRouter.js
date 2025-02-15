import { logout } from "../controllers/auth_controller.js";
import express from "express";
import passport from "passport";

const router = express.Router();

// OAuth 로그인 라우팅 (네이버)
router.get("/login/naver", passport.authenticate("naver"));
router.get(
	"/callback/naver",
	passport.authenticate("naver", {
		failureRedirect: "/oauth2/login/naver",
		failureMessage: true,
	}),
	(req, res) => {
		const { id, accessToken, refreshToken } = req.user;

		req.session.accessToken = accessToken; //로그아웃을 위해 세션에 토큰 저장
		req.session.refreshToken = refreshToken; //DB 세션 테이블에서 data에 들어간다

		res.success({ id, accessToken, refreshToken });
		res.redirect("https://auth.expo.io/@m_jin_2/CaffeineDrop");
	}
);

// OAuth 로그인 라우팅 (카카오)
router.get("/login/kakao", passport.authenticate("kakao"));
router.get(
	"/callback/kakao",
	passport.authenticate("kakao", {
		failureRedirect: "/oauth2/login/kakao",
		failureMessage: true,
	}),
	(req, res) => {
		const { id, accessToken, refreshToken } = req.user;

		req.session.accessToken = accessToken; //로그아웃을 위해 세션에 토큰 저장
		req.session.refreshToken = refreshToken; //DB 세션 테이블에서 data에 들어간다

		res.success({ id, accessToken, refreshToken });
		res.redirect("https://auth.expo.io/@m_jin_2/CaffeineDrop");
	}
);

// 로그아웃 라우팅
router.post("/logout", logout);

export default router;

/*
app.js에 적용시 app.use('/oauth2', authRouter);
*/
