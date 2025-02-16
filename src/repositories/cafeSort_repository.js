import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class sortRepository {
  static async sortCafeByEvalu(evaluation) {
    console.log(`sorting cafe with : ${evaluation}`);
    try {
      const cafeSort = await prisma.cafe.findMany({
        include: {
          _count: {
            select: {
              likes: true,
            },
          },
        },
        orderBy: {
          [evaluation]: { _count: 'desc' },
          // latitude: 'desc',
        },
      });
      // console.log('Cafe:', cafeSort); // 카페 정렬 정보 출력
      return cafeSort || [];
    } catch (error) {
      console.error('Error fetching cafe from database:', error);
      throw new Error('Error fetching cafe from database');
    }
  }
}
