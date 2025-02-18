import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

// 카페 정보를 조회하는 함수
export const getCafe = async (cafeId) => {
  const cafe = await prisma.Cafe.findFirst({ where: { cafe_id: cafeId } });
  if (!cafe) {
    return null;
  }
    
  return cafe;
}

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
          operating_hours: {
            select: {
              cafe_id: true,
              day_of_week: true,
              open_time: true,
              close_time: true,
            },
          },
          images: {
            select: {
              cafe_image_id: true,
              cafe_id: true,
              image_url: true,
              is_thumbnail: true,
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

  static async findCafe() {
    const cafe = await prisma.cafe.findMany({
      select: { cafe_id: true },
    });
    return cafe;
  }
}