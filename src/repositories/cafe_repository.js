import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class CafeRepository {
  static async findCafeById(cafeId) {
    console.log(`Fetching cafe with id: ${cafeId}`);
    try {
      const cafe = await prisma.cafe.findUnique({
        where: { cafe_id: cafeId },
        include: {
          menu_items: {
            select: {
              name: true,
              description: true,
              price: true,
            },
          },
        },
      });
      console.log('Cafe found:', cafe); // 카페 정보 출력
      return cafe;
    } catch (error) {
      console.error('Error fetching cafe from database:', error);
      throw new Error('Error fetching cafe from database');
    }
  }
}
