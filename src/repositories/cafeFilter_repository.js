// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// export class CafeRepository {
//   static async findCafesByFilters(filters = {}) {
//     console.log('filters:', filters);
//     const { dayOfWeek, time, likes, rating } = filters;
//     const whereCondition = {};

//     if (dayOfWeek && time) {
//       // time을 Date 객체로 변환 후 9시간 추가 (UTC → KST) js기본이 utc기준이어서 변환 필수
//       const kstTime = new Date(time);
//       kstTime.setHours(kstTime.getHours() + 9);

//       whereCondition.operating_hours = {
//         some: {
//           day_of_week: dayOfWeek.trim(),
//           open_time: { lte: kstTime },
//           close_time: { gte: kstTime },
//         },
//       };
//     }

//     // console.log('filter:', whereCondition);
//     const cafes = await prisma.cafe.findMany({
//       where: whereCondition,
//       select: {
//         cafe_id: true,
//         name: true,
//         operating_hour: true,

//         _count: {
//           select: {
//             likes: true,
//           },
//         },
//         // 리뷰 및 평점 관련 데이터 가져오기
//         reviews: {
//           select: {
//             evaluations: {
//               select: {
//                 rating: true, // 평점
//               },
//             },
//           },
//         },
//       },
//     });

//     const cafesWithLikes = likes
//       ? cafes.filter((cafe) => cafe._count.likes >= parseInt(likes, 10))
//       : cafes;

//     // rating 필터링 (평점이 있을 경우)
//     const cafesWithRating = rating
//       ? cafesWithLikes.filter((cafe) => {
//           // 평점 계산
//           const avgRating = cafe.reviews.reduce((acc, review) => {
//             review.cafeEvaluations.forEach((evaluation) => {
//               acc += evaluation.rating; // 평점 합산
//             });
//             return acc;
//           }, 0);

//           const totalEvaluations = cafe.reviews.reduce((acc, review) => {
//             return acc + review.cafeEvaluations.length; // 평점의 개수
//           }, 0);

//           const avg = totalEvaluations > 0 ? avgRating / totalEvaluations : 0; // 평균 평점

//           return avg >= parseFloat(rating); // 평점 필터링
//         })
//       : cafesWithLikes; // rating 필터가 없으면 likes 필터만 적용된 카페들 반환

//     return cafesWithRating;
//   }
// }
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class CafeRepository {
  static async findCafesByFilters(filters = {}) {
    const { dayOfWeek, time, likes, rating } = filters;
    const whereCondition = {};

    if (dayOfWeek && time) {
      // time을 Date 객체로 변환 후 9시간 추가 (UTC → KST) js기본이 utc기준이어서 변환 필수
      const kstTime = new Date(time);
      kstTime.setHours(kstTime.getHours() + 9);

      whereCondition.operating_hours = {
        some: {
          day_of_week: dayOfWeek.trim(),
          open_time: { lte: kstTime },
          close_time: { gte: kstTime },
        },
      };
    }

    // Prisma 쿼리로 리뷰와 평가 데이터를 함께 가져오기
    const cafes = await prisma.cafe.findMany({
      where: whereCondition,
      select: {
        cafe_id: true,
        name: true,
        operating_hour: true,
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
