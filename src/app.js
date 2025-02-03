import express from "express";
import cors from "cors";
import syncCafesToElasticsearch from "./middlewares/elasticsearch.js";
import responseMiddleware from "./middlewares/responseMiddleware.js";
import searchMiddleware from "./middlewares/search_route.js";
import cafeCheckMiddleware from "./middlewares/cafeCheck_middleware.js";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import fs from "fs";
const app = express();

// CORS 미들웨어
app.use(cors());
// 정적 파일 제공 미들웨어
app.use(express.static("public"));
// JSON 파싱 미들웨어
app.use(express.json());
// URL 인코딩 미들웨어
app.use(express.urlencoded({ extended: true }));

// YAML 파일 로드
const swaggerDocument = yaml.load(fs.readFileSync("../swagger.yaml", "utf8"));
// Swagger UI 설정
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 서버 시작 시 ElasticSearch 동기화 실행
app.use(syncCafesToElasticsearch);
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
