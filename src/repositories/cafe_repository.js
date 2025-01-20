import {prisma} from './prisma.js';

export const getCafe = async (cafeId) => {
  const cafe = await prisma.Cafe.findFirst( { where: { cafe_id: cafeId} } );
  if (!cafe) {
    return null;
  }
    
  return cafe;
}

