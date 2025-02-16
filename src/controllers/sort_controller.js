import { StatusCodes } from 'http-status-codes';
import { sortCafe } from '../services/cafeSort_service.js';
import { InternalServerError, NotFoundError } from '../error/error.js';
import { cafeSortDto } from '../dtos/cafeSort_dto.js';

export const handleSortCafes = async (req, res, next) => {
  try {
    const { sort } = req.query;
    console.log(sort);

    // 기본값 설정 (sort가 없을 경우 'likes'을 기본값으로 사용)
    const evaluation = sort || 'likes';

    // 서비스 호출하여 정렬
    const cafeSort = await sortCafe.sortByEvalu(evaluation);
    // console.log('controllerTest', cafeSort);
    if (!Array.isArray(cafeSort)) {
      return res
        .status(500)
        .json({ message: '카페 데이터가 배열이 아닙니다.' });
    }
    // 카페 정보 반환
    return res.status(200).json(cafeSort);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message });
    }

    if (error instanceof InternalServerError) {
      return res.status(500).json({ message: error.message });
    }

    return res
      .status(500)
      .json({ message: '알 수 없는 에러', error: error.message });
  }
};
