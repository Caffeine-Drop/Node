import * as user_service from "../services/user_service.js";
import * as user_dto from "../dtos/user_dto.js";
import { NotFoundError, ValidationError } from "../error/error.js";

//사용 가능한 닉네임인지 확인 요청을 받았을 때, 검사할 수 있도록 service계층에 DTO를 통해 데이터를 보내고,
//검사결과를 응답하기 위한 함수
export const checkNicknameOverlap = async (req, res) => {
	try {
		const { nickname } = req.params;
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
		const { userId, nickname } = req.body;
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
		const { userId, newNickname } = req.body;
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
		const { user_id } = req.params;
		const user = await user_service.getUserInfo(user_id);
		return res.success(user);
	} catch (error) {
		if (error instanceof NotFoundError) {
			return res.error(error, 404);
		}
		return res.error(error, 500);
	}
};

//업로드된 파일 정보를 추출하고 인증 정보와 URL를 service에 전달하기 위한 함수
export const uploadProfileImage = async (req, res, next) => {
	try {
	  // 파일이 업로드되지 않았을 경우 에러 처리
	  if (!req.file || !req.file.location) {
		return res.error(new ValidationError('파일 업로드에 실패했습니다.'), 400);
	  }
	  
	  const imageUrl = req.file.location;  // S3에 저장된 이미지 URL
	  const userId = req.user.user_id;   //세션에서 userId를 가져옴
	  const updatedUser = await user_service.updateProfileImage(userId, imageUrl); // Service 계층에 프로필 이미지 업데이트 요청
  
	  return res.success({ user: updatedUser });
	} catch (error) {
		if (error instanceof ValidationError) {
			return res.error(error, 400);
		}
		return res.error(error, 500);
	}
  };
