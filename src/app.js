import express from "express";
import cors from "cors";
import syncCafesToElasticsearch from "./middlewares/elasticsearch.js";
import responseMiddleware from "./middlewares/responseMiddleware.js";
import searchMiddleware from "./middlewares/search_route.js";
import cafeCheckMiddleware from "./middlewares/cafeCheck_middleware.js";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const app = express();

// CORS 미들웨어
app.use(cors());
// 정적 파일 제공 미들웨어
app.use(express.static("public"));
// JSON 파싱 미들웨어
app.use(express.json());
// URL 인코딩 미들웨어
app.use(express.urlencoded({ extended: true }));

// 현재 파일 경로를 얻기 위한 코드
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Swagger YAML 파일 경로 설정
const swaggerPath = path.resolve(__dirname, "../swagger.yaml");
const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, "utf8"));

// Swagger UI 설정
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 표준 응답 미들웨어
app.use(responseMiddleware);
// 카페 전체정보 조회 미들웨어
app.use(cafeCheckMiddleware);
// 검색 관련 API 미들웨어
app.use("/search", searchMiddleware);

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
