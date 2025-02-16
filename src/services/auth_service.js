import dotenv from 'dotenv';
import axios from 'axios';  // 외부 API 호출을 위해 axios 사용
import { InternalServerError } from '../error/error.js';
dotenv.config();

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