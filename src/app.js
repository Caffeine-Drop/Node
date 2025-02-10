import express from "express";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();
import responseMiddleware from './middlewares/responseMiddleware.js';
import searchMiddleware from './middlewares/search_route.js';
import cafeCheckMiddleware from './middlewares/cafeCheck_middleware.js';
import likeMiddelware from './middlewares/like_route.js';
import userRouter from './routes/userRoutes.js'; // 사용자 관련 라우터 import
import authRouter from './routes/authRouter.js'; // 연동 로그인 인증 관련 라우터 import
import { setupPassport } from './auth.js'; // auth.js에서 Passport 설정 import
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { NotFoundError } from "./error/error.js";

const app = express();

// CORS 미들웨어
app.use(cors());
// 정적 파일 제공 미들웨어
app.use(express.static("public"));
// JSON 파싱 미들웨어
app.use(express.json());
// URL 인코딩 미들웨어
app.use(express.urlencoded({ extended: true }));
// 표준 응답 미들웨어
app.use(responseMiddleware);

// Passport와 세션 미들웨어 설정
setupPassport(app);  // auth.js에서 설정된 Passport 및 세션 설정 적용

// 사용자 관련 라우터 연동
app.use('/users', userRouter);

app.use('/oauth2', authRouter);

// 기본 경로
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

/*
// 404 처리
app.use((req, res, next) => {
  throw new Error("The requested resource was not found");
});
*/

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
