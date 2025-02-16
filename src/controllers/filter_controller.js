import { StatusCodes } from 'http-status-codes';
import { CafeService } from '../services/cafeFilter_service.js';
import { InternalServerError, NotFoundError } from '../error/error.js';
import { CafeFilterDto } from '../dtos/cafeFilter_dto.js';

export const handleFilterCafe = async (req, res) => {
  try {
    const { dayOfWeek, time, likes, rating } = req.query;
    console.log('dayOfWeek:', dayOfWeek, 'time:', time, 'likes:', likes);

    // CafeFilterDto로 필터링 조건을 생성
    const filterDto = new CafeFilterDto(dayOfWeek, time, likes, rating);
    console.log('filterdto', filterDto);

    const cafeService = new CafeService();
    const cafes = await cafeService.getCafesByFilters(filterDto);

    // 카페 정보 반환
    return res.status(StatusCodes.OK).json(cafes);
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: error.message });
    }

    if (error instanceof InternalServerError) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: '알 수 없는 에러', error: error.message });
  }
};
