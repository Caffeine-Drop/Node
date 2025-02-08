import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

// 로스팅 정보 조회 함수
export const getRoasting = async (roastingId) => {
  const roasting = await prisma.Roasting.findFirst({ where: { roasting_id: roastingId } });
  if (!roasting) {
    return null;
  }
  
  return roasting;
}