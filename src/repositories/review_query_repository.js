import { PrismaClient } from "@prisma/client";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const prisma = new PrismaClient();

// S3 설정
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// Presigned URL 생성 함수
const getPresignedUrl = async (key) => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    return await getSignedUrl(s3, command, { expiresIn: 3600 }); // Presigned URL 유효기간 1시간
  } catch (error) {
    console.error("Presigned URL 생성 실패:", error);
    return null;
  }
};

/// 특정 카페의 리뷰 목록을 가져오는 레포지토리
export const getReviews = async (cafeId, offset, limit) => {
  return prisma.review.findMany({

    where: { cafe_id: Number(cafeId) },
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
  }).then(async (reviews) => {
    // 이미지 Presigned URL 변환
    for (const review of reviews) {
      for (const image of review.images) {
        if (image.image_url) {
          image.image_url = await getPresignedUrl(image.image_url); // Presigned URL 변환
        }
      }
    }
    return reviews;
  });
};

/// 특정 카페의 총 리뷰 개수를 가져오는 레포지토리
export const getTotalReviews = async (cafeId) => {
  return prisma.review.count({
    where: { cafe_id: Number(cafeId) },
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