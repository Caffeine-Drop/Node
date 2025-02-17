import {
  getReviews as fetchReviews, 
  getTotalReviews as fetchTotalReviews,
  getCafeRatings as fetchCafeOverallRating,
} from "../repositories/review_query_repository.js";
import {
  ValidationError,
  NotFoundError,
  InternalServerError,
} from "../error/error.js";

const validateString = (value, fieldName) => {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ValidationError(`${fieldName}는 유효한 문자열이어야 합니다.`);
  }
  return value.trim();
};

export const getReviews = async (cafeId, userId, offset = 0, limit = 10) => {
  try {
    // 유효성 검사
    const parsedCafeId = Number(cafeId);
    if (isNaN(parsedCafeId) || parsedCafeId <= 0) {
      throw new ValidationError("cafeId는 양의 정수여야 합니다.");
    }

    const parsedUserId = validateString(userId, "userId");
    const parsedOffset = Number(offset);
    const parsedLimit = Number(limit);

    if (isNaN(parsedOffset) || parsedOffset < 0) {
      throw new ValidationError("offset은 0 이상의 숫자여야 합니다.");
    }

    if (isNaN(parsedLimit) || parsedLimit <= 0) {
      throw new ValidationError("limit은 1 이상의 숫자여야 합니다.");
    }

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

export const getRatings = async (cafeId) => {
  return await fetchCafeOverallRating(cafeId);
}