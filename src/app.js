import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import * as user_controller from "./controllers/user_controller.js";
import responseMiddleware from "./middlewares/reponseMiddleware.js";


dotenv.config();

const app = express();

//CORS 미들웨어
app.use(cors());
//정적 파일 제공 미들웨어
app.use(express.static("public"));
//JSON 파싱 미들웨어
app.use(express.json());
//URL 인코딩 미들웨어
app.use(express.urlencoded({ extended: true }));
//표준 응답 미들웨어
app.use(responseMiddleware);

app.get("/", (req, res) => {
	res.send("Hello, Express!");
});

// 404 처리
/*
app.use((req, res, next) => {
	throw new NotFoundError("The requested resource was not found");
});
*/

//닉네임이 중복인지 검사하는 API(20자 이내 조건 추가)
app.get('/users/nickname/check', user_controller.checkNicknameOverlap);
//닉네임을 생성하는 API
app.post('/users/nickname', user_controller.createNickname);
//닉네임을 변경하는 API
app.patch('/users/nickname', user_controller.changeNickname);
//유저의 정보를 조회하는 API
app.get('/users/:user_id', user_controller.getUserInfo);

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