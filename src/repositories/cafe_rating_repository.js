import prisma from "../prisma.js";

/// 특정 카페의 네 가지 평가 항목의 평균을 계산하는 레포지토리
export const getCafeRatings = async (cafeId) => {
  return prisma.cafeEvaluation.groupBy({
    by: ["evaluation_criteria_id"],
    where: { review: { cafe_id: (cafeId) } },
    _avg: {
      rating: true,
    },
    select: {
      evaluation_criteria: {
        select: {
          name: true,
        },
      },
      _avg: {
        rating: true,
      },
    },
  });
};
