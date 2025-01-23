import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

export const getCafe = async (cafeId) => {
  const cafe = await prisma.Cafe.findFirst( { where: { cafe_id: cafeId} } );
  if (!cafe) {
    return null;
  }
    
  return cafe;
}

