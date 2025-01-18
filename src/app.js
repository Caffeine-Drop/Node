import express from "express";
import cors from "cors";

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
