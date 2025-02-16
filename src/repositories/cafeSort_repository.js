//likes,reviews,평가항목 정렬 기능
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class sortRepository {
  static async sortCafeByEvalu(evaluation) {
    console.log(`Sorting cafes by evaluation criteria: ${evaluation}`);

    try {
      let cafes;

      if (evaluation === 'likes' || evaluation === 'reviews') {
        // 'likes' 또는 'reviews' 개수를 기준으로 정렬
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

        // JavaScript의 sort()를 사용하여 정렬
        cafes = cafes.sort(
          (a, b) => b._count[evaluation] - a._count[evaluation]
        );
      } else {
        // 평가 기준에 따른 정렬
        const evaluationCriteria = await prisma.evaluationCriteria.findFirst({
          where: { name: evaluation },
          select: { evaluation_criteria_id: true },
        });

        if (!evaluationCriteria) {
          throw new Error(`Evaluation criteria "${evaluation}" not found`);
        }

        const evaluationCriteriaId = evaluationCriteria.evaluation_criteria_id;

        // 카페 목록 가져오기
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

        // 평균 평점 계산
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

        // 평균 평점 기준 정렬
        cafes = cafesWithAvgRating.sort((a, b) => b.avgRating - a.avgRating);
      }

      return cafes;
    } catch (error) {
      console.error('Error fetching cafes from database:', error);
      throw new Error('Error fetching cafes from database');
    }
  }
}
