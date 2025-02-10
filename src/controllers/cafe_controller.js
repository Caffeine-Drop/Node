import { StatusCodes } from 'http-status-codes';
import { readCafeInfos } from '../services/cafe_service.js';
import { NotFoundError } from '../error/error.js';

export const handleReadCafes = async (req, res, next) => {
  try {
    const cafeId = parseInt(req.params.cafe_id);
    console.log(cafeId);
    // cafeId가 유효한지 체크
    if (isNaN(cafeId)) {
      return res.status(400).json({ error: 'Invalid cafeId' });
    }

    // 서비스 호출하여 카페 정보 조회
    const cafe = await readCafeInfos.getCafeById(cafeId);

    // 카페 정보 반환
    return res.status(200).json(cafe);
  } catch (error) {
    console.error(error);
    // 에러 발생 시 처리
    return res.status(500).json({ error: error.message });
  }
};

export const readAllCafe = async (req, res, next) => {
  try {
      const cafes = await readCafeInfos.getCafe();
      return res.status(200).json({
          message: '전체 카페 id 반환',
          cafeList : cafes,
      });
  } catch (error) {
      return res.status(500).json({ message: '알 수 없는 에러', error: error.message });
  }
}