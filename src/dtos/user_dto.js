//사용가능한 닉네임인지를 검사하는 과정에서 다른 계층(controller -> service)에 데이터를 전달하기 위한 DTO를 구현하는 함수
//닉네임이 20자 이하인지 검사하여 유효성을 검증한다.
export const checkNicknameDto = (nickname) => {
  if (nickname.length > 20) {
    throw new Error('닉네임은 20자 이하로 입력하여야 함');
  }
  return nickname;
};
  
//닉네임 생성 과정에서 다른 계층(controller -> service)에 데이터를 전달하기 위한 DTO를 구현하는 함수
//유저아이디와 닉네임을 받아 유효하지 않은 값(false, 0, "", null, undefined, NaN)인지를 검사함으로써 유효성을 검증한다.
export const createNicknameDto = (userId, nickname) => {
  if (userId == false || nickname == false) {
    throw new Error('유저 아이디와 닉네임을 모두 제공받아야 함');
  }
  return { userId, nickname };
};

//닉네임 변경 과정에서 다른 계층(controller -> service)에 데이터를 전달하기 위한 DTO를 구현하는 함수
//유저아이디와 닉네임을 받아 유효하지 않은 값(false, 0, "", null, undefined, NaN)인지를 검사함으로써 유효성을 검증한다.
export const changeNicknameDto = (userId, newNickname) => {
  if (userId == false || newNickname == false) {
    throw new Error('유저 아이디와 새로운 닉네임을 모두 제공받아야 함.');
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