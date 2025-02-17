// //likes,reviews,평가항목 정렬 기능
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export class sortRepository {
//   static async sortCafeByEvalu(evaluation) {
//     console.log(`Sorting cafes by evaluation criteria: ${evaluation}`);

//     try {
//       let cafes;

//       if (evaluation === 'likes' || evaluation === 'reviews') {
//         // 'likes' 또는 'reviews' 개수를 기준으로 정렬
//         cafes = await prisma.cafe.findMany({
//           include: {
//             _count: {
//               select: {
//                 likes: true,
//                 reviews: true,
//               },
//             },
//           },
//         });

//         // JavaScript의 sort()를 사용하여 정렬
//         cafes = cafes.sort(
//           (a, b) => b._count[evaluation] - a._count[evaluation]
//         );
//       } else {
//         // 평가 기준에 따른 정렬
//         const evaluationCriteria = await prisma.evaluationCriteria.findFirst({
//           where: { name: evaluation },
//           select: { evaluation_criteria_id: true },
//         });

//         if (!evaluationCriteria) {
//           throw new Error(`Evaluation criteria "${evaluation}" not found`);
//         }

//         const evaluationCriteriaId = evaluationCriteria.evaluation_criteria_id;

//         // 카페 목록 가져오기
//         cafes = await prisma.cafe.findMany({
//           include: {
//             reviews: {
//               select: {
//                 evaluations: {
//                   where: { evaluation_criteria_id: evaluationCriteriaId },
//                   select: { rating: true },
//                 },
//               },
//             },
//           },
//         });

//         // 평균 평점 계산
//         const cafesWithAvgRating = cafes.map((cafe) => {
//           const allRatings = cafe.reviews.flatMap((review) =>
//             review.evaluations.map((evals) => evals.rating)
//           );

//           const avgRating =
//             allRatings.length > 0
//               ? allRatings.reduce((sum, rating) => sum + rating, 0) /
//                 allRatings.length
//               : 0;

//           return { ...cafe, avgRating };
//         });

//         // 평균 평점 기준 정렬
//         cafes = cafesWithAvgRating.sort((a, b) => b.avgRating - a.avgRating);
//       }

//       return cafes;
//     } catch (error) {
//       console.error('Error fetching cafes from database:', error);
//       throw new Error('Error fetching cafes from database');
//     }
//   }
// }

//거리 추가 버전
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class sortRepository {
  static async sortCafeByEvalu(evaluation, userLat = null, userLng = null) {
    console.log(`Sorting cafes by evaluation: ${evaluation}`);
    console.log(userLat, userLng);

    // lat, lng 값이 유효한지 확인
    const lat = parseFloat(userLat);
    const lng = parseFloat(userLng);

    // 거리 기준 정렬
    if (evaluation === 'distance') {
      if (isNaN(lat) || isNaN(lng) || userLat === null || userLng === null) {
        throw new Error(
          'Latitude and Longitude are required for distance sorting'
        );
      }
      return this.sortCafeByDistance(lat, lng);
    }

    try {
      let cafes;

      // 'likes' 또는 'reviews' 개수 기준 정렬
      if (evaluation === 'likes' || evaluation === 'reviews') {
        cafes = await prisma.cafe.findMany({
          include: {
            _count: {
              select: {
                likes: true,
                reviews: true,
              },
            },
          },
        });

        cafes = cafes.sort(
          (a, b) => b._count[evaluation] - a._count[evaluation]
        );
      } else {
        // 평가 기준에 따라 정렬
        const evaluationCriteria = await prisma.evaluationCriteria.findFirst({
          where: { name: evaluation },
          select: { evaluation_criteria_id: true },
        });

        if (!evaluationCriteria) {
          throw new Error(`Evaluation criteria "${evaluation}" not found`);
        }

        const evaluationCriteriaId = evaluationCriteria.evaluation_criteria_id;

        cafes = await prisma.cafe.findMany({
          include: {
            reviews: {
              select: {
                evaluations: {
                  where: { evaluation_criteria_id: evaluationCriteriaId },
                  select: { rating: true },
                },
              },
            },
          },
        });

        const cafesWithAvgRating = cafes.map((cafe) => {
          const allRatings = cafe.reviews.flatMap((review) =>
            review.evaluations.map((evals) => evals.rating)
          );

          const avgRating =
            allRatings.length > 0
              ? allRatings.reduce((sum, rating) => sum + rating, 0) /
                allRatings.length
              : 0;

          return { ...cafe, avgRating };
        });

        cafes = cafesWithAvgRating.sort((a, b) => b.avgRating - a.avgRating);
      }

      return cafes;
    } catch (error) {
      console.error('Error fetching cafes from database:', error);
      throw new Error('Error fetching cafes from database');
    }
  }

  // 거리 계산 후 정렬
  static async sortCafeByDistance(userLat, userLng) {
    console.log(
      `Sorting cafes by distance from user location: (${userLat}, ${userLng})`
    );

    try {
      const cafes = await prisma.cafe.findMany({
        select: {
          cafe_id: true,
          name: true,
          address: true,
          phone_number: true,
          latitude: true,
          longitude: true,
        },
      });

      // 거리 계산 함수 (Haversine Formula)
      function getDistance(lat1, lon1, lat2, lon2) {
        const toRad = (value) => (value * Math.PI) / 180;
        const R = 6371; // Earth radius in km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // returns the distance in km

        console.log('dis:', distance);
        return distance;
      }
      // 거리 계산 후 정렬
      const sortedCafes = cafes
        .map((cafe) => ({
          ...cafe,
          distance: getDistance(
            userLat,
            userLng,
            cafe.latitude,
            cafe.longitude
          ),
        }))
        .sort((a, b) => a.distance - b.distance);

      // 거리 값에 'km' 추가
      return sortedCafes.map((cafe) => ({
        ...cafe,
        distance: `${cafe.distance.toFixed(2)} km`,
      }));
    } catch (error) {
      console.error('Error sorting cafes by distance:', error);
      throw new Error('Error sorting cafes by distance');
    }
  }
}
