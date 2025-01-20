import express from "express";
import cors from "cors";
import { NotFoundError } from "./error/error.js";
import { getBeanDetail } from "./controllers/bean_controller.js";
import { handleCafeBean } from "./controllers/cafe_controller.js";
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
app.use((req, res, next) => {
	// 성공 응답 메서드 추가
	res.success = (data, status = 200) => {
	  res.status(status).json({
		success: true,
		error: null,
		data,
	  });
	};
  
	// 오류 응답 메서드 추가
	res.error = (error, status = 400) => {
	  res.status(status).json({
		success: false,
		name: error.name || 'Error',
		message: error.message || 'An unexpected error occurred',
		...(error.details ? { details: error.details } : {}),  // 추가 정보가 있으면 포함
	  });
	};
  
	next();});

app.get("/", (req, res) => {
	res.send("Hello, Express!");
});

// 원두 상세조회 API 
app.get("/beans/:bean_id", getBeanDetail);

// 카페 보유원두 추가 API
app.post("/cafes/:cafe_id/beans/:bean_id", handleCafeBean);



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
