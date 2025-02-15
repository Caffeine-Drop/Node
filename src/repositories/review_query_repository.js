import prisma from "../prisma.js";

/// 특정 카페의 리뷰 목록을 가져오는 레포지토리
export const getReviews = async (cafeId, offset, limit) => {
  return prisma.review.findMany({

    where: { cafe_id: (cafeId) },
    skip: (offset),
    take: (limit),
    where: { 
      cafe_id: Number(cafeId),
      user_id: userId,
    },
    skip: Number(offset),
    take: Number(limit),
    orderBy: { created_at: "desc" },
    select: {
      review_id: true,
      content: true,
      created_at: true,
      updated_at: true,
      user: {
        select: {
          user_id: true,
          nickname: true,
          profile_image_url: true,
        },
      },
      cafe: {
        select: {
          cafe_id: true,
          name: true,
        },
      },
      images: {
        select: {
          review_image_id: true,
          image_url: true,
        },
      },
      evaluations: {
        select: {
          rating: true,
        },
      },
    },
  });
};

/// 특정 카페의 총 리뷰 개수를 가져오는 레포지토리
export const getTotalReviews = async (cafeId) => {
  return prisma.review.count({
    where: { cafe_id: (cafeId) },
  });
};

/// 특정 카페의 별점 데이터를 가져오는 레포지토리
export const getCafeRatings = async (cafeId) => {
  return prisma.cafeEvaluation.findMany({
    where: { review: { cafe_id: (cafeId) } },
    _avg: {
      rating: true,
    },
  });
};