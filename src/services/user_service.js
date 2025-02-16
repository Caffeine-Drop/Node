import * as user_repository from '../repositories/user_repository.js';
import { NotFoundError, InternalServerError} from '../error/error.js';
import { getUserInfoDto } from '../dtos/user_dto.js';

//controller계층에서 전달받은 데이터가 데이터베이스에 존재하는 지 확인하려 다른 계층에 데이터를 보내고(service -> repository),
//데이터베이스에 존재하지 않는다면(중복이 아니라면) true를, 존재한다면(중복이라면) false를 반환(service -> controller)하기 위한 함수
export const checkNicknameOverlap = async (nickname) => {
  try {
    const user = await user_repository.findByNickname(nickname);
    if (user == null) return true;
    return false;
  } catch (error) {
    throw new InternalServerError('닉네임 중복 검사 중 에러 발생');
  }
};

//controller계층에서 전달받은 유저아이디와 닉네임이 서로 관계를 지니도록 데이터베이스에 생성하기 위해, 
//다른 계층에 데이터를 보내고(service -> repository),
//데이터베이스에 유저아이디가 존재하지 않는다면 에러를 발생시키고, 존재한다면 데이터베이스에 생성한 후,
//그 닉네임을 반환(service -> controller)하기 위한 함수
export const createNickname = async (userId, nickname) => {
  try {
    const existingUser = await user_repository.findByUserId(String(userId));
    if (existingUser == null) 
      throw new NotFoundError('유저아이디를 찾을 수 없습니다.');
    const result = await user_repository.createNickname(String(userId), nickname);
    return nickname;
  } catch (error) {
    if (error instanceof NotFoundError)
      throw error;
    throw new InternalServerError('닉네임 생성을 실패했습니다.');
  }
};

//controller계층에서 전달받은 유저아이디에 대응하는 닉네임을 데이터베이스 상에서 변경하기 위해, 
//다른 계층에 데이터를 보내고(service -> repository),
//데이터베이스에 유저아이디가 존재하지 않는다면 에러를 발생시키고, 존재한다면 데이터베이스에 있는 닉네임을 변경한 후,
//그 닉네임을 반환(service -> controller)하기 위한 함수
export const changeNickname = async (userId, newNickname) => {
  try {
    const existingUser = await user_repository.findByUserId(String(userId));
    if (existingUser == null) throw new NotFoundError('유저 아이디를 찾을 수 없습니다.');
    await user_repository.changeNickname(String(userId), newNickname);
    return newNickname;
  } catch (error) {
    if (error instanceof NotFoundError)
      throw error;
    throw new InternalServerError('닉네임 변경을 실패했습니다.');
  }
};

//controller계층에서 전달받은 유저아이디의 정보를 조회하기 위해 다른 계층에 데이터를 보내고(service -> repository),
//데이터베이스에 유저아이디가 존재하지 않는다면 에러를 발생시키고, 존재한다면 그 사용자의 정보를 조회하여,
//DTO를 거처 유저 정보를 반환(service -> controller)하기 위한 함수
export const getUserInfo = async (userId) => {
  try {
    const user = await user_repository.findByUserId(String(userId));
    if (user == null) throw new NotFoundError('유저 아이디를 찾을 수 없습니다.');
    return getUserInfoDto(user);
  } catch (error) {
    if (error instanceof NotFoundError)
      throw error;
    throw new InternalServerError('사용자 정보 조회를 실패했습니다');
  }
};

//userId가 유효한 지 검증하고, repository에 정보를 넘겨주기 위한 함수
export const updateProfileImage = async (userId, imageUrl) => {
  if (!userId) {
    throw new Error('유효하지 않은 사용자입니다.');
  }
  
  const updatedUser = await user_repository.updateUserProfileImage(userId, imageUrl);
  return updatedUser;
};