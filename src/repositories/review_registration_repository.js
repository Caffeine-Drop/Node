import prisma from "../prisma.js";
import { InternalServerError } from "../error/error.js";

// 리뷰 등록 (트랜잭션 적용)
export const createReview = async (reviewData) => {
  const { cafeId, userId, content, evaluations, images } = reviewData;

  try {
    const review = await prisma.$transaction(async (tx) => {
      // 1. 리뷰 저장
      const newReview = await tx.review.create({
        data: {
          cafe_id: cafeId,
          user_id: userId,
          content: content || null,
        },
      });

      // 2. 평점 저장 (필수 입력)
      if (!evaluations || evaluations.length !== 4) {
        throw new InternalServerError("평점 항목 4개를 모두 입력해야 합니다.");
      }
      await tx.evaluation.createMany({
        data: evaluations.map((evaluation) => ({
          review_id: newReview.review_id,
          evaluation_criteria_id: evaluation.criteriaId,
          rating: evaluation.rating,
        })),
      });

     // 3. 이미지 저장 (이미지가 있을 경우에만 실행)
     if (images && images.length > 0) {
      await tx.reviewImage.createMany({
        data: images.map((imageUrl) => ({
          review_id: newReview.review_id,
          image_url: imageUrl,
        })),
      });
    }

      // 4. 저장된 데이터 함께 반환
      return tx.review.findUnique({
        where: { review_id: newReview.review_id },
        include: {
          evaluations: true,
          images: true,
        },
      });
    });

    return review;
  } catch (error) {
    console.error("Error in createReview:", error);
    throw new InternalServerError("리뷰 저장 중 오류가 발생했습니다.");
  }
};
