import { ValidationError } from '../error/error.js';

//사용가능한 닉네임인지를 검사하는 과정에서 다른 계층(controller -> service)에 데이터를 전달하기 위한 DTO를 구현하는 함수
//닉네임이 20자 이하인지 검사하여 유효성을 검증한다.
export const checkNicknameDto = (nickname) => {
  if (!nickname) {  //request body에 아예 빼버리는 경우도 필터링 하기 위해 nickname == false가 아닌 !nickname 사용
    throw new ValidationError('닉네임을 제공해야 합니다.');
  } else if (nickname.length > 20) {
    throw new ValidationError('20글자를 초과하는 닉네임입니다.');
  }
  return nickname;
};
  
//닉네임 생성 과정에서 다른 계층(controller -> service)에 데이터를 전달하기 위한 DTO를 구현하는 함수
//유저아이디와 닉네임을 받아 유효하지 않은 값(false, 0, "", null, undefined, NaN)인지를 검사함으로써 유효성을 검증한다.
export const createNicknameDto = (userId, nickname) => {
  if (!userId || !nickname) { //request body에 아예 빼버리는 경우도 필터링 하기 위해 nickname == false가 아닌 !nickname 사용
    throw new ValidationError('유저 아이디와 닉네임을 모두 제공받지 않음');
  }
  return { userId, nickname };
};

//닉네임 변경 과정에서 다른 계층(controller -> service)에 데이터를 전달하기 위한 DTO를 구현하는 함수
//유저아이디와 닉네임을 받아 유효하지 않은 값(false, 0, "", null, undefined, NaN)인지를 검사함으로써 유효성을 검증한다.
export const changeNicknameDto = (userId, newNickname) => {
  if (!userId || !newNickname) { //request body에 아예 빼버리는 경우도 필터링 하기 위해 nickname == false가 아닌 !nickname 사용
    throw new ValidationError('유저 아이디와 새 닉네임을 모두 제공받지 않음');
  }
  return { userId, newNickname };
};
  
//유저 정보 조회 과정에서 다른 계층(service -> controller)에 데이터베이스의 정보 중 일부를 선별하여 전달하기 위한 DTO를 구현하는 함수
export const getUserInfoDto = (user) => {
  return {
    userId: user.user_id,
    nickname: user.nickname,
    email: user.email,
    profileImageUrl: user.profile_image_url,
    createdAt: user.created_at,
    updatedAt: user.updated_at
  };
};