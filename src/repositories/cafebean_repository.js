import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

export const addCafeBean = async (data) => {
  const cafeBeanId = await prisma.cafeBean.create({data: data});
  return cafeBeanId;
}

export const getCafeBeanByKey = async (data) => {
  const cafeBean = await prisma.cafeBean.findFirst({where: {cafe_id: data.cafe_id, bean_id: data.bean_id}});
  if(!cafeBean){
    return null;
  }
  return cafeBean;
}

export const getBeansByCafeID = async(data) =>{
  const result = await prisma.cafeBean.findMany(
    {
      where: {cafe_id: data},
      select: {bean_id: true}
    }
  );
  return result;
}