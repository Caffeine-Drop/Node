import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class CafeRepository {
  static async findCafesByFilters(filters = {}) {
    const { dayOfWeek, time, likes, rating, criteria } = filters;
    const whereCondition = {};

    if (dayOfWeek || time) {
      whereCondition.operating_hours = {
        some: {},
      };

      if (dayOfWeek) {
        whereCondition.operating_hours.some.day_of_week = dayOfWeek.trim();
      }

      if (time) {
        const kstTime = new Date(time);

        whereCondition.operating_hours.some.open_time = { lte: kstTime };
        whereCondition.operating_hours.some.close_time = { gte: kstTime };
      }
    }

    // criteria 조건 적용
    if (criteria) {
      whereCondition.filters = {
        some: {
          filter_criteria: {
            name: criteria.trim(),
          },
          is_applied: true,
        },
      };
    }

    // Prisma 쿼리로 리뷰와 평가 데이터를 함께 가져오기
    const cafes = await prisma.cafe.findMany({
      where: whereCondition,
      select: {
        cafe_id: true,
        name: true,
        operating_hours: true,
        _count: {
          select: {
            likes: true,
          },
        },
        reviews: {
          select: {
            evaluations: {
              select: {
                rating: true, // 평점
              },
            },
          },
        },
        // criteria가 있을 경우 필터 정보도 포함
        ...(criteria && {
          filters: {
            select: {
              filter_criteria: {
                select: {
                  name: true,
                },
              },
            },
          },
        }),
      },
    });

    // likes 필터링
    const cafesWithLikes = likes
      ? cafes.filter((cafe) => cafe._count.likes >= parseInt(likes, 10))
      : cafes;

    // rating 필터링 (평균 평점이 있을 경우)
    const cafesWithRating = rating
      ? cafesWithLikes.filter((cafe) => {
          // 평점 계산
          let avgRating = 0;
          let totalEvaluations = 0;

          cafe.reviews.forEach((review) => {
            review.evaluations.forEach((evaluation) => {
              avgRating += evaluation.rating; // 평점 합산
              totalEvaluations++;
            });
          });

          const avg = totalEvaluations > 0 ? avgRating / totalEvaluations : 0; // 평균 평점

          return avg >= parseFloat(rating); // 입력된 rating 필터 값보다 큰 카페만 반환
        })
      : cafesWithLikes; // rating 필터가 없으면 likes 필터만 적용된 카페들 반환

    return cafesWithRating;
  }
}
