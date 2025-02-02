import passport from 'passport';
import { naverStrategy, kakaoStrategy } from './auth.config.js'; // naver, kakao 전략 설정
import session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { prisma } from './db.config.js';

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
