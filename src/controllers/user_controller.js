import * as user_service from "../services/user_service.js";
import * as user_dto from "../dtos/user_dto.js";
import { NotFoundError, ValidationError } from "../error/error.js";

import { s3 } from '../config/s3Client.js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//사용 가능한 닉네임인지 확인 요청을 받았을 때, 검사할 수 있도록 service계층에 DTO를 통해 데이터를 보내고,
//검사결과를 응답하기 위한 함수
export const checkNicknameOverlap = async (req, res) => {
	try {
		const nickname = req.body.nickname;
		const validNickname = user_dto.checkNicknameDto(nickname);
		const isNotOverlap = await user_service.checkNicknameOverlap(validNickname); //true(중복아님) or false(중복임)를 리턴
		return res.success({ isNotOverlap });
	} catch (error) {
		if (error instanceof ValidationError) {
			return res.error(error, 400);
		}
		return res.error(error, 500);
	}
};

//닉네임 생성 요청을 받으면, 요청한 유저 아이디에 대응하는 닉네임을 생성하기 위해 service계층에 DTO를 통해 데이터를 보내고,
//생성 성공일 때 그 닉네임으로 응답해주기 위한 함수
export const createNickname = async (req, res) => {
	try {
		const nickname = req.body.nickname;
		const userId = req.user_id;
		const { userId: validUserId, nickname: validNickname } =
			user_dto.createNicknameDto(userId, nickname);
		const newNickname = await user_service.createNickname(
			validUserId,
			validNickname
		);

		return res.success({ nickname: newNickname }, 201); // 상태 코드 201을 사용하여 생성 성공 응답
	} catch (error) {
		if (error instanceof NotFoundError) {
			return res.error(error, 404);
		} else if (error instanceof ValidationError) {
			return res.error(error, 400);
		}
		return res.error(error, 500);
	}
};

//닉네임 변경 요청을 받으면, 요청한 유저 아이디에 대응하는 닉네임을 변경하기 위해 service계층에 DTO를 통해 데이터를 보내고,
//변경 성공일 때 그 닉네임으로 응답해주기 위한 함수
export const changeNickname = async (req, res) => {
	try {
		const userId = req.user_id;
		const newNickname = req.body.nickname;
		const { userId: validUserId, newNickname: validNewNickname } =
			user_dto.changeNicknameDto(userId, newNickname);
		const updatedNickname = await user_service.changeNickname(
			validUserId,
			validNewNickname
		);
		return res.success({ nickname: updatedNickname });
	} catch (error) {
		if (error instanceof NotFoundError) {
			return res.error(error, 404);
		} else if (error instanceof ValidationError) {
			return res.error(error, 400);
		}
		return res.error(error, 500);
	}
};

//어떤 유저에 대한 정보 조회 요청을 받으면, 정보를 조회하기 위해 해당 유저 아이디를 service계층에 보내고,
//조회 성공일 때, 그 정보로 응답해주기 위한 함수
export const getUserInfo = async (req, res) => {
	try {
		const user_id = req.user_id;
		const user = await user_service.getUserInfo(user_id);
		return res.success(user);
	} catch (error) {
		if (error instanceof NotFoundError) {
			return res.error(error, 404);
		}
		return res.error(error, 500);
	}
};

// URL로 프로필 사진 변경 API
export const uploadProfileImage = async (req, res) => {
	try {
	  const { imageUrl } = req.body;
	  const userId = req.user.id;
  
	  if (!imageUrl) {
		return res.status(400).json({ error: "이미지 URL이 필요합니다." });
	  }
  
	  // 이미지 다운로드
	  const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
	  const fileBuffer = Buffer.from(response.data, "binary");
  
	  // 파일명 생성
	  const ext = path.extname(imageUrl) || ".jpg";
	  const fileName = `profile-images/${uuidv4()}${ext}`;
  
	  // S3 업로드
	  const uploadParams = {
		Bucket: "caffeinedrop",
		Key: fileName,
		Body: fileBuffer,
		ContentType: response.headers["content-type"],
		ACL: "public-read",
	  };
  
	  await s3.send(new PutObjectCommand(uploadParams));
  
	  const s3Url = `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  
	  // DB에 프로필 이미지 URL 저장
	  const updatedUser = await prisma.user.update({
		where: { id: userId },
		data: { profileImage: s3Url },
	  });
  
	  res.json({
		message: "프로필 사진 변경 성공",
		imageUrl: updatedUser.profileImage,
	  });
  
	} catch (error) {
	  console.error("프로필 사진 변경 실패:", error);
	  res.status(500).json({ error: "프로필 사진 변경 실패" });
	}
};