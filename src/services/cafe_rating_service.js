import { getCafeRatings as fetchCafeRatings } from "../repositories/cafe_rating_repository.js";
import { ValidationError, NotFoundError, InternalServerError } from "../error/error.js";

export const getCafeRating = async (cafeId) => {
  try {
    const parsedCafeId = Number(cafeId);
    if (isNaN(parsedCafeId) || parsedCafeId <= 0) {
      throw new ValidationError("cafeId는 양의 정수여야 합니다.");
    }

    const ratings = await fetchCafeRatings(parsedCafeId);
    if (!ratings || ratings.length === 0) {
      throw new NotFoundError("해당 카페의 평가 데이터가 없습니다.");
    }

    // 네 가지 평가 항목별 점수를 매핑
    const ratingMap = {};
    ratings.forEach(({ evaluation_criteria, _avg }) => {
      ratingMap[evaluation_criteria.name] = _avg.rating || null;
    });

    return {
      taste: ratingMap["taste"] || null,
      interior: ratingMap["interior"] || null,
      cleanliness: ratingMap["cleanliness"] || null,
      value_for_money: ratingMap["value_for_money"] || null,
    };
  } catch (error) {
    if (error instanceof ValidationError || error instanceof NotFoundError) {
      throw error;
    }
    console.error("Error in getCafeRating service:", error);
    throw new InternalServerError("카페 별점 조회 중 서버 에러가 발생했습니다.");
  }
};