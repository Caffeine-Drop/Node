import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

// 카페_원두 추가 함수
export const addCafeBean = async (data) => {
  const cafeBeanId = await prisma.cafeBean.create({data: data});
  return cafeBeanId;
}

// 카페_원두 조회 함수 (카페아이디, 원두아이디로 조회)
export const getCafeBeanByKey = async (data) => {
  const cafeBean = await prisma.cafeBean.findFirst({where: {cafe_id: data.cafe_id, bean_id: data.bean_id}});
  if(!cafeBean){
    return null;
  }
  return cafeBean;
}

// 카페_원두 조회 함수 (카페아이디로 조회)
export const getBeansByCafeID = async(data) =>{
  const result = await prisma.cafeBean.findMany(
    {
      where: {cafe_id: data},
      select: {bean_id: true}
    }
  );
  return result;
}