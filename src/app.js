import express from "express";
import cors from "cors";
import responseMiddleware from './middlewares/responseMiddleware.js';
import searchMiddleware from './middlewares/search_route.js';
import cafeCheckMiddleware from './middlewares/cafeCheck_middleware.js';
import likeMiddelware from './middlewares/like_route.js';
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { NotFoundError } from "./error/error.js";

const app = express();

// ESM 환경에서 __dirname을 얻는 방법
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Swagger YAML 파일 경로 설정 (절대 경로 사용)
const swaggerPath = path.join(__dirname, "../swagger.yaml");

// Swagger UI 설정 && Swagger 파일이 존재하는지 확인
if (!fs.existsSync(swaggerPath)) {
	console.error("swagger.yaml 파일이 존재하지 않습니다:", swaggerPath);
} else {
	const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, "utf8"));
	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

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
// 카페 전체정보 조회 미들웨어
app.use(cafeCheckMiddleware);
// 검색 관련 API 미들웨어
app.use('/search', searchMiddleware);
// 좋아요 관련 API 미들웨어
app.use("/like", likeMiddelware);

app.get("/", (req, res) => {
	res.send("Hello, Express!");
});

// 404 처리
app.use((req, res, next) => {
	throw new NotFoundError("The requested resource was not found");
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
	// 사용자 정의 에러 처리
	if (err.name && err.message) {
		return res.error(err, err.status || 400);
	}

	// 기타 에러 처리
	console.error(err);
	res.error(new Error("Internal server error"), 500);
});

export default app;
