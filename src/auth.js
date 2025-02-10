import passport from 'passport';
import axios from 'axios';
import { naverStrategy, kakaoStrategy } from './auth.config.js'; // naver, kakao 전략 설정
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { prisma } from './db.config.js';
import { ValidationError } from './error/error.js';

export const setupPassport = (app) => {
  // Passport 전략 설정
  passport.use(naverStrategy);
  passport.use(kakaoStrategy);
  
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  // 세션 미들웨어 설정
  app.use(
    session({
      cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 1주일
      },
      resave: false,
      saveUninitialized: false,
      secret: process.env.EXPRESS_SESSION_SECRET,
      store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
      }),
    })
  );

  // Passport 초기화 및 세션 설정
  app.use(passport.initialize());
  app.use(passport.session());
};

/*
app.js에 적용시 setupPassport(app);
*/

// 카카오 로그아웃 처리 함수
export const kakaoLogout = async (accessToken) => {
  try {
    const response = await axios.post(
      'https://kapi.kakao.com/v1/user/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new ValidationError("카카오 로그아웃 실패");
  }
};

// 네이버 로그아웃 처리 함수
export const naverLogout = async (accessToken, redirectUrl) => {
  try {
    // 네이버 로그아웃 API 호출
    const logoutUrl = 'https://nid.naver.com/nidlogin.logout';
    
    // 로그아웃을 완료한 후 리디렉션될 페이지를 설정할 수 있습니다.
    const url = `${logoutUrl}?url=${encodeURIComponent(redirectUrl)}`;
    
    // 네이버 API 호출 (실제로 로그아웃을 처리하는 부분은 URL 리디렉션을 통해 수행됩니다)
    // 여기서는 네이버 API와 직접적인 통신을 하지는 않지만, 필요한 경우 추가로 네이버 API 호출을 넣을 수 있습니다.
    
    return url; // 로그아웃 후 리디렉션 URL 반환
  } catch (error) {
    throw new Error("네이버 로그아웃 실패");
  }
};