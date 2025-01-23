import * as user_service from '../services/user_service.js';
import * as user_dto from '../dtos/user_dto.js'

//사용 가능한 닉네임인지 확인 요청을 받았을 때, 검사할 수 있도록 service계층에 DTO를 통해 데이터를 보내고,
//검사결과를 응답하기 위한 함수
export const checkNicknameOverlap = async (req, res) => {
  try {
    const { nickname } = req.body;
    const validNickname = user_dto.checkNicknameDto(nickname)
    const isNotOverlap = await user_service.checkNicknameOverlap(validNickname);  //true(중복아님) or false(중복임)를 리턴
    return res.status(200).json({ isNotOverlap });
  } catch (error) {
    return res.status(500).json({ message: '닉네임 검사 에러' });
  }
};

//닉네임 생성 요청을 받으면, 요청한 유저 아이디에 대응하는 닉네임을 생성하기 위해 service계층에 DTO를 통해 데이터를 보내고, 
//생성 성공일 때 그 닉네임으로 응답해주기 위한 함수
export const createNickname = async (req, res) => {
  try {
    const { userId, nickname } = req.body;
    const { userId: validUserId, nickname: validNickname} = user_dto.createNicknameDto(userId, nickname);
    const newNickname = await user_service.createNickname(validUserId, validNickname);
    return res.status(201).json({ nickname: newNickname });
  } catch (error) {
    return res.status(500).json({ message: '닉네임 생성 에러' });
  }
};

//닉네임 변경 요청을 받으면, 요청한 유저 아이디에 대응하는 닉네임을 변경하기 위해 service계층에 DTO를 통해 데이터를 보내고, 
//변경 성공일 때 그 닉네임으로 응답해주기 위한 함수
export const changeNickname = async (req, res) => {
  try {
    const { userId, newNickname } = req.body;
    const { userId: validUserId, newNickname: validNewNickname } = user_dto.changeNicknameDto(userId, newNickname);
    const updatedNickname = await user_service.changeNickname(validUserId, validNewNickname);
    return res.status(200).json({ nickname: updatedNickname });
  } catch (error) {
    return res.status(500).json({ message: '닉네임 변경 에러' });
  }
};

//어떤 유저에 대한 정보 조회 요청을 받으면, 정보를 조회하기 위해 해당 유저 아이디를 service계층에 보내고,
//조회 성공일 때, 그 정보로 응답해주기 위한 함수
export const getUserInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await user_service.getUserInfo(userId);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: '사용자 정보 조회 에러' });
  }
};