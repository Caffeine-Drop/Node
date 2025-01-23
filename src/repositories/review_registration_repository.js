import prisma from "../prisma.js";

// 리뷰 등록
export const createReview = async (reviewData) => {
  const { cafeId, userId, content, evaluations, images } = reviewData;

  return prisma.review.create({
    data: {
      cafe_id: Number(cafeId),
      user_id: Number(userId),
      content,
      evaluations: {
        create: evaluations.map((evaluation) => ({
          evaluation_criteria_id: evaluation.criteriaId,
          rating: evaluation.rating,
        })),
      },
      images: {
        create: images.map((imageUrl) => ({
          image_url: imageUrl,
        })),
      },
    },
    include: {
      evaluations: true,
      images: true,
    },
  });
};
