import {
  getReviews as fetchReviews, 
  getTotalReviews as fetchTotalReviews,
  getCafeOverallRating as fetchCafeOverallRating,
} from "../repositories/review_query_repository.js";
import {
  ValidationError,
  NotFoundError,
  InternalServerError,
} from "../error/error.js";

const validateNumber = (value, fieldName) => {
  const parsedValue = Number(value);
  if (isNaN(parsedValue)) {
    throw new ValidationError(`${fieldName}는 숫자여야 합니다.`);
  }
  if (parsedValue < 0) {
    throw new ValidationError(`${fieldName}는 음수일 수 없습니다.`);
  }
  return parsedValue;
};

export const getReviews = async (cafeId, offset = 0, limit = 10) => {
  try {
    // 유효성 검사
    const parsedCafeId = validateNumber(cafeId, "cafeId");
    const parsedOffset = validateNumber(offset, "offset");
    const parsedLimit = validateNumber(limit, "limit");

    // 리뷰 조회 및 총 개수 가져오기
    const reviews = await fetchReviews(parsedCafeId, parsedOffset, parsedLimit);
    const totalCount = await fetchTotalReviews(parsedCafeId);
    const overallRatingResult = await fetchCafeOverallRating(parsedCafeId);

    // 리뷰 존재 여부 확인
    if (reviews.length === 0) {
      throw new NotFoundError("해당 카페에 리뷰가 존재하지 않습니다.");
    }

    const overallRating = overallRatingResult._avg.rating
    ? parseFloat(overallRatingResult._avg.rating.toFixed(1)) // 평균 별점만 반올림
    : null;

    // 페이지네이션 정보 계산
    const currentPage = Math.ceil(parsedOffset / parsedLimit) + 1;
    const totalPages = Math.ceil(totalCount / parsedLimit);

    return {
      reviews,
      totalCount,
      currentPage,
      totalPages,
      overallRating,
    };

  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error; // 기존 에러 객체를 다시 던짐
    }
    console.error("Error in getReviews service:", error);
    throw new InternalServerError("리뷰를 가져오는 중 서버 에러가 발생했습니다.");
  }
};