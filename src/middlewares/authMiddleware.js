import { fetch } from 'undici';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: '토큰이 필요합니다.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: '유효하지 않은 토큰 형식입니다.' });
  }

  try {
    let userData;

    if (req.headers['provider'] === 'kakao') {
      const kakaoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!kakaoResponse.ok) throw new Error('카카오 토큰 검증 실패');
      const kakaoData = await kakaoResponse.json();
      userData = { user_id: kakaoData.id };

    } else if (req.headers['provider'] === 'naver') {
      const naverResponse = await fetch('https://openapi.naver.com/v1/nid/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!naverResponse.ok) throw new Error('네이버 토큰 검증 실패');
      const naverData = await naverResponse.json();
      userData = { user_id: naverData.response.id };

    } else {
      return res.status(400).json({ message: '유효한 provider(카카오, 네이버)를 지정해주세요.' });
    }

    console.log(userData)
    req.user_id = userData.user_id;
    next();
  } catch (error) {
    return res.status(403).json({ message: '토큰 검증 실패', error: error.message });
  }
};