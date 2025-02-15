import dotenv from "dotenv";
import { Strategy as KakaoStrategy } from "passport-kakao"
import { Strategy as NaverStrategy } from "passport-naver-v2";
import { NotFoundError, ValidationError } from "./error/error.js";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

dotenv.config();

//네이버 인증 전략 설정
export const naverStrategy = new NaverStrategy(
  {
    clientID: process.env.PASSPORT_NAVER_CLIENT_ID,  
    clientSecret: process.env.PASSPORT_NAVER_CLIENT_SECRET, 
    callbackURL: "https://auth.expo.io/@m_jin_2/CaffeineDrop", //인증 후 콜백 URL
    scope: ["profile", "email"], //요청할 권한
  },
  (accessToken, refreshToken, profile, cb) => {
    return naverVerify(profile, accessToken, refreshToken)  //프로필을 이용해 유저를 검증하고, 반환된 유저 정보를 콜백함수로 전달
      .then((user) => cb(null, user))  //성공 시 유저 정보 전달
      .catch((err) => cb(err));  //실패 시 에러 전달
  }
);

const naverVerify = async (profile, accessToken, refreshToken) => {
  try{
    const email = profile.email;  //네이버 프로필에서 이메일 추출
    if (email == false) {
    throw new NotFoundError(`profile.email was not found: ${profile}`);  // 이메일이 없으면 에러 처리
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (user !== null) {  // 이미 유저가 존재하면 해당 유저 정보 반환
      return { id: user.user_id, email: user.email, accessToken, refreshToken };
    }

    const createdUser = await prisma.user.create({
      data: {
        user_id: profile.id, //네이버에서 주는 id값을 user_id로 저장
        email,
        email_type: "naver",
        nickname: profile.name || " ",  // 프로필 이름이 없으면 빈 문자열로 처리
        profile_image_url: profile.profile_image,  // 프로필 이미지 URL 저장
        created_at: new Date(),
        updated_at: new Date(),
    },
  });
  return { id: createdUser.user_id, email: createdUser.email, accessToken, refreshToken };  // 새로 생성된 유저의 ID와 이메일 반환
  } catch (err) {
    throw new ValidationError('네이버 인증 과정 중 에러 발생');
  }
};

//카카오 인증 전략 설정
export const kakaoStrategy = new KakaoStrategy(
  {
    clientID: process.env.PASSPORT_KAKAO_CLIENT_ID,  
    clientSecret: process.env.PASSPORT_KAKAO_CLIENT_SECRET,
    callbackURL: "https://auth.expo.io/@m_jin_2/CaffeineDrop", //인증 후 콜백 URL
  },
  (accessToken, refreshToken, profile, cb) => {
    return kakaoVerify(profile, accessToken, refreshToken) //프로필을 이용해 유저를 검증하고, 반환된 유저 정보를 콜백함수로 전달
      .then((user) => cb(null, user)) //성공 시 유저 정보 전달
      .catch((err) => cb(err));  //실패 시 에러 전달
  }
);
  
const kakaoVerify = async (profile, accessToken, refreshToken) => {
  try{
    const email = profile._json.kakao_account.email;
    if (!email) {
      throw new NotFoundError(`profile.email was not found: ${profile}`); //카카오 프로필에서 이메일 추출
    }
  
    const user = await prisma.user.findUnique({ where: { email } });
    if (user !== null) {  //이미 유저가 존재하면 해당 유저 정보 반환
      return { id: user.user_id, email: user.email, accessToken, refreshToken };
    }
  
    const createdUser = await prisma.user.create({
      data: {
        user_id: String(profile.id), //정수형으로 오기에 문자형으로 바꾸어 저장
        email,
        email_type: "kakao",
        nickname: profile.name || " ", //프로필 이름이 없으면 빈 문자열로 저장
        profile_image_url: profile.profile_image,  //프로필 이미지 URL 저장
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  
    return { id: createdUser.user_id, email: createdUser.email, accessToken, refreshToken };
  } catch (err) {
    throw new ValidationError('카카오 인증 과정 중 에러 발생');
  }
};