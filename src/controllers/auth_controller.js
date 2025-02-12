import * as auth_service from '../services/auth_service.js';

export const logoutUserFromNaver = async (req, res) => {
  try {
    const accessToken = req.user.accessToken; // 사용자의 access token
    const redirectUrl = 'http://13.124.11.195:3000/token'; // 로그아웃 후 리디렉션할 URL 설정

    // 네이버 로그아웃 서비스 호출
    await auth_service.logoutUserFromNaver(accessToken, redirectUrl);

    res.success({ message: '로그아웃 성공', redirectUrl}, 200);
  } catch (error) {
    res.error(error, 500);
  }
};