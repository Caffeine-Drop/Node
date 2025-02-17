import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

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

// 특정 카페의 별점 데이터를 가져오는 레포지토리
export const getCafeRatings = async (cafeId) => {
  // 전체 평점(평균) 계산
  const averageRating = await prisma.cafeEvaluation.aggregate({
    where: {
      review: {
        cafe_id: cafeId,
      },
    },
    _avg: {
      rating: true, // 평균 평점
    },
  });

  // 세부 평점 (각 평가 기준에 따른 rating 값) 가져오기
  const detailedRatings = await prisma.cafeEvaluation.findMany({
    where: {
      review: {
        cafe_id: cafeId,
      },
    },
    select: {
      rating: true,
      evaluation_criteria: {
        select: {
          name: true, // 평가 기준의 이름
        },
      },
    },
  });

  if (!averageRating._avg.rating) {
    console.log("해당 카페에 대한 평가 정보가 존재하지 않습니다.");
  }

  return {
    averageRating: averageRating._avg.rating, // 평균 평점 반환
    detailedRatings: detailedRatings.map((item) => ({
      rating: item.rating, // 세부 평점
      criteria: item.evaluation_criteria.name, // 평가 기준 이름
    })),
  };
};