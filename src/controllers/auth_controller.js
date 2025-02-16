import { InternalServerError, NotFoundError, ValidationError } from '../error/error.js';
import { logoutServiceKakao, logoutServiceNaver } from '../services/auth_service.js';

//네이버인지 카카오인지 분리하고 각각에 맞는 로그아웃 절차를 매칭해주기 위한 함수
//로그아웃 절차가 끝나면 세션을 종료시킨다.
export const logout = async (req, res) => {
  const { provider } = req.body;  //네이버인지, 카카오인지

  if (!provider) {
    return res.error(new ValidationError('provider 정보가 필요합니다.'), 400);
  }

  try {
    const { accessToken, refreshToken } = req.session;  //로그인 시 세션에 저장했던 id, accessToken, refreshToken 끌어오기
                                                        //로그인 이후 부터 기본적으로 header에 붙는 쿠키를 이용한다.
    if (!accessToken){
      return res.error(new NotFoundError('로그인된 사용자가 없습니다.'), 404);
    }

    // provider에 따라 로그아웃 서비스 호출
    if (provider === 'kakao') {
      await logoutServiceKakao(accessToken, refreshToken);  // 카카오 로그아웃 서비스 호출
    } else if (provider === 'naver') {
      await logoutServiceNaver(accessToken, refreshToken);  // 네이버 로그아웃 서비스 호출
    } else {
      return res.error(new ValidationError('지원하지 않는 provider입니다.'), 400);
    }

    // 세션 종료 처리
    req.session.destroy((err) => {  //세션 테이블이 PrismaSessionStore과 연결되어 있으므로 세션 종료시 자동으로 DB내 데이터 삭제
      if (err) {
        return res.error(new InternalServerError('세션 종료 실패'), 500);
      }
      res.success({ message: '로그아웃 성공' });
    });
  } catch (error) {
    console.error('로그아웃 처리 오류:', error);
    res.error(error);
  }
};