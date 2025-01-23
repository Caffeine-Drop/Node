import * as user_repository from '../repositories/user_repository.js';
import { getUserInfoDto } from '../dtos/user_dto.js';

//controller계층에서 전달받은 데이터가 데이터베이스에 존재하는 지 확인하려 다른 계층에 데이터를 보내고(service -> repository),
//데이터베이스에 존재하지 않는다면(중복이 아니라면) true를, 존재한다면(중복이라면) false를 반환(service -> controller)하기 위한 함수
export const checkNicknameOverlap = async (nickname) => {
  try {
    const user = await user_repository.findByNickname(nickname);
    if (user == null) return true;
    return false;
  } catch (error) {
    throw new Error('닉네임 중복 검사 중 오류가 발생');
  }
};

//controller계층에서 전달받은 유저아이디와 닉네임이 서로 관계를 지니도록 데이터베이스에 생성하기 위해, 
//다른 계층에 데이터를 보내고(service -> repository),
//데이터베이스에 유저아이디가 존재하지 않는다면 에러를 발생시키고, 존재한다면 데이터베이스에 생성한 후,
//그 닉네임을 반환(service -> controller)하기 위한 함수
export const createNickname = async (userId, nickname) => {
  try {
    const existingUser = await user_repository.findByUserId(userId);
    if (existingUser == null) 
        throw new Error('사용자를 찾을 수 없음.');
    await user_repository.createNickname(userId, nickname);
    return nickname;
  } catch (error) {
    throw new Error('닉네임 생성 중 오류가 발생.');
  }
};

//controller계층에서 전달받은 유저아이디에 대응하는 닉네임을 데이터베이스 상에서 변경하기 위해, 
//다른 계층에 데이터를 보내고(service -> repository),
//데이터베이스에 유저아이디가 존재하지 않는다면 에러를 발생시키고, 존재한다면 데이터베이스에 있는 닉네임을 변경한 후,
//그 닉네임을 반환(service -> controller)하기 위한 함수
export const changeNickname = async (userId, newNickname) => {
  try {
    const existingUser = await user_repository.findByUserId(userId);
    if (existingUser == null) throw new Error('사용자를 찾을 수 없음.');
    await user_repository.changeNickname(userId, newNickname);
    return newNickname;
  } catch (error) {
    throw new Error('닉네임 변경 중 오류가 발생.');
  }
};

//controller계층에서 전달받은 유저아이디의 정보를 조회하기 위해 다른 계층에 데이터를 보내고(service -> repository),
//데이터베이스에 유저아이디가 존재하지 않는다면 에러를 발생시키고, 존재한다면 그 사용자의 정보를 조회하여,
//DTO를 거처 유저 정보를 반환(service -> controller)하기 위한 함수
export const getUserInfo = async (userId) => {
  try {
    const user = await user_repository.findByUserId(userId);
    if (user == false) throw new Error('사용자를 찾을 수 없음.');
    return getUserInfoDto(user);
  } catch (error) {
    throw new Error('사용자 정보 조회 중 오류가 발생.');
  }
};
