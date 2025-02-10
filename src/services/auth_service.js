import { naverLogout } from './auth'; // auth.js에 네이버 로그아웃 처리 함수 가져오기
import { updateUserSession } from '../repositories/auth_repository.js'; // 세션 삭제를 위한 repository 호출
import { InternalServerError } from '../error/error.js';

export const logoutUserFromNaver = async (accessToken, redirectUrl) => {
  try {
    // 네이버 로그아웃을 처리하는 함수 호출
    const logoutUrl = await naverLogout(accessToken, redirectUrl);

    // 로그아웃 후 세션을 종료하거나, 필요시 데이터베이스에서 세션을 삭제할 수 있습니다.
    await updateUserSession(); // 예시로 세션 삭제 메소드 호출

    return logoutUrl; // 로그아웃 URL을 반환
  } catch (error) {
    throw new InternalServerError('네이버 로그아웃 실패');
  }
};