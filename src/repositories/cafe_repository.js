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

