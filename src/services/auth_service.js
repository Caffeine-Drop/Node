import dotenv from 'dotenv';
import queryString from 'query-string';
import axios from 'axios';  // 외부 API 호출을 위해 axios 사용
import { InternalServerError, NotFoundError, ValidationError } from '../error/error.js';
import { findByUserId, createUser } from '../repositories/user_repository.js';
dotenv.config();

/*
1) code로 카카오 토큰 엔드포인트에 요청하여 accessToken, refreshToken 획득
2) accessToken으로 카카오 프로필 조회
3) DB에서 해당 이메일 유저 조회 → 없으면 생성
4) 유저 정보 + 토큰 반환
 */
export async function kakaoLoginService(code, redirect_uri) {
  const tokenURL = 'https://kauth.kakao.com/oauth/token';
  const data = {
    grant_type: 'authorization_code',
    client_id: process.env.PASSPORT_KAKAO_CLIENT_ID,
    client_secret: process.env.PASSPORT_KAKAO_CLIENT_SECRET,
    redirect_uri,
    code,
  };

  try {
    //code로 카카오 토큰 엔드포인트에 요청해 accessToken, refreshToken 획득
    const tokenRes = await axios.post(tokenURL, queryString.stringify(data), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const { access_token, refresh_token } = tokenRes.data;

    //accessToken으로 카카오 프로필 조회
    const profileRes = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const profile = profileRes.data;
    //profile 예시: { id: 123456, kakao_account: { email: "...", ... }, properties: { nickname: "...", profile_image: "..." } }

    //아이디 추출
    const userId = String(profile.id);
    if (!userId) {
      throw new NotFoundError('카카오 프로필에 아이디가 없습니다.');
    }

    //이메일 추출
    const email = profile?.kakao_account?.email;
    if (!email) {
      throw new NotFoundError('카카오 프로필에 이메일이 없습니다.');
    }

    //DB 조회 후 없으면 유저 생성
    let user = await findByUserId(userId);
    if (!user) {
      user = await createUser({
        user_id: userId,
        email,
        email_type: 'kakao',
        nickname: profile?.properties?.nickname || ' ',
        profile_image_url: profile?.properties?.profile_image || ' ',
      });
    }

    //유저 정보 + 토큰 반환
    return {
      id: user.user_id,
      email: user.email,
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  } catch (err) {
    throw new ValidationError('카카오 인증 에러');
  }
}

// 네이버 로그아웃 서비스, 직접 기능하기보단 비즈니즈 로직을 담는 함수
export const logoutServiceNaver = async (accessToken, refreshToken) => {
  try {
    let validAccessToken = accessToken; // 기본적으로 기존 accessToken 사용

    try {   
      await requestNaverLogout(validAccessToken, refreshToken);  // 먼저 accessToken을 이용해 로그아웃 요청
      return;
    } catch (error) {
      if (error.response && error.response.status === 401) {   // 만약 accessToken이 만료되었다면 refreshToken으로 재발급 후 재시도
        validAccessToken = await refreshNaverAccessToken(refreshToken);
        
        await requestNaverLogout(validAccessToken, refreshToken); // 새로 발급받은 accessToken으로 로그아웃 재시도
      } else {
        throw new InternalServerError('네이버 로그아웃 실패');
      }
    }
  } catch (error) {
    console.error('네이버 로그아웃 오류:', error);
    throw new InternalServerError('네이버 로그아웃 실패');
  }
};

//네이버 로그아웃 요청 함수, 실질적으로 로그아웃을 실행하는 함수
const requestNaverLogout = async (accessToken, refreshToken) => {
  const naverLogoutUrl = 'https://nid.naver.com/oauth2.0/logout';  //네이버 로그아웃 URL

  await axios.get(naverLogoutUrl, {  //보내는 정보들들
    params: {
      grant_type: 'delete',
      client_id: process.env.PASSPORT_NAVER_CLIENT_ID,
      client_secret: process.env.PASSPORT_NAVER_CLIENT_SECRET,
      access_token: accessToken,
      refresh_token: refreshToken,
    },
  });
};

//네이버 액세스토큰 요청 함수 (액세스토큰이 만료되었을 때 refreshToken으로 재발급받기 위함)
const refreshNaverAccessToken = async (refreshToken) => {
  try {
    const tokenUrl = 'https://nid.naver.com/oauth2.0/token';
    const response = await axios.get(tokenUrl, {
      params: {
        grant_type: 'refresh_token',
        client_id: process.env.PASSPORT_NAVER_CLIENT_ID,
        client_secret: process.env.PASSPORT_NAVER_CLIENT_SECRET,
        refresh_token: refreshToken,
      },
    });
    // 재발급 받은 액세스 토큰 반환
    return response.data.access_token;
  } catch (error) {
    console.error('액세스 토큰 재발급 오류:', error);
    throw new InternalServerError('액세스 토큰 재발급 실패');
  }
};

// 카카오 로그아웃 서비스
export const logoutServiceKakao = async (accessToken, refreshToken) => {
  try {
    let validAccessToken = accessToken; // 기본적으로 기존 accessToken 사용

    try {
      // 먼저 accessToken을 이용해 로그아웃 요청
      await requestKakaoLogout(validAccessToken);
      return;
    } catch (error) {
      if (error.response && error.response.status === 401) {  // 만약 accessToken이 만료되었다면 refreshToken으로 재발급 후 재시도
        validAccessToken = await refreshKakaoAccessToken(refreshToken);
        await requestKakaoLogout(validAccessToken);  // 새로 발급받은 accessToken으로 로그아웃 재시도
      } else {
        throw new InternalServerError('카카오 로그아웃 실패');
      }
    }
  } catch (error) {
    console.error('카카오 로그아웃 오류:', error);
    throw new InternalServerError('카카오 로그아웃 실패');
  }
};

// 카카오 로그아웃 요청 함수, 실질적으로 로그아웃을 실행하는 함수
const requestKakaoLogout = async (accessToken) => {
  const kakaoLogoutUrl = 'https://kapi.kakao.com/v1/user/logout';  // 카카오 로그아웃 URL

  await axios.post(kakaoLogoutUrl, null, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

// 카카오 액세스 토큰 요청 함수 (액세스토큰이 만료되었을 때 refreshToken으로 재발급받기 위함)
const refreshKakaoAccessToken = async (refreshToken) => {
  try {
    const tokenUrl = 'https://kauth.kakao.com/oauth/token';
    const response = await axios.post(tokenUrl, null, {
      params: {
        grant_type: 'refresh_token',
        client_id: process.env.PASSPORT_KAKAO_CLIENT_ID,
        client_secret: process.env.PASSPORT_KAKAO_CLIENT_SECRET,
        refresh_token: refreshToken,
      },
    });

    // 재발급 받은 액세스 토큰 반환
    return response.data.access_token;
  } catch (error) {
    console.error('액세스 토큰 재발급 오류:', error);
    throw new InternalServerError('카카오 액세스 토큰 재발급 실패');
  }
};