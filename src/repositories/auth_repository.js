import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { InternalServerError } from "../error/error.js";

//service 계층에서 전달받은 닉네임이 데이터베이스에 존재하는지를 확인하여 중복여부를 확인하기 위한 함수
//해당 닉네임을 가진 유저의 정보를 반환(repository -> service)한다
export const findByNickname = async (nickname) => {
  try {
    const user = await prisma.user.findFirst({
      where: { nickname: nickname },
    });
    return user;
  } catch (error) {
    throw new InternalServerError('중복 검사중 데이터베이스 조회 오류');
  }
};

//service 계층에서 전달받은 유저아이디가 데이터베이스에 존재하는지를 확인하여 유효한 유저아이디인지를 확인하기 위한 함수
//유저의 정보를 반환(repository -> service)한다
export const findByUserId = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    return user;
  } catch (error) {
    throw new InternalServerError('데이터베이스 조회 오류');
  }
};

//service 계층에서 전달받은 유저아이디에 대응하는 닉네임을 데이터베이스에서 생성하고, 생성하지 못할 경우 에러를 발생시키기 위한 함수
export const createNickname = async (userId, nickname) => {
  try {
    const user = await prisma.user.update({
      where: { user_id: userId },
      data: { nickname },  
    });
    return user;
  } catch (error) {
    throw new InternalServerError('닉네임 생성 오류');
  }
};

//service 계층에서 전달받은 유저아이디에 대응하는 닉네임을 데이터베이스에서 생성하고, 생성하지 못할 경우 에러를 발생시키기 위한 함수
export const changeNickname = async (userId, newNickname) => {
  try {
    const user = await prisma.user.update({
      where: { user_id: userId },
      data: { nickname: newNickname },
    });
    return user;
  } catch (error) {
    throw new InternalServerError('닉네임 변경 오류');
  }
};