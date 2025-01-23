import { createReview } from "../repositories/review_registration_repository.js";
import { ValidationError } from "../error/error.js";

export const registerReview = async (reviewDTO) => {
  try {
    return await createReview({
      cafeId: reviewDTO.cafeId,
      userId: reviewDTO.userId,
      content: reviewDTO.content,
      evaluations: reviewDTO.evaluations,
      images: reviewDTO.images,
    });
  } catch (error) {
    console.error("Error in registerReview:", error);
    throw new ValidationError("리뷰 등록에 실패했습니다.");
  }
};
