import { prisma } from './prisma.js';

export const addCafeBean = async (data) => {
  const cafeBeanId = await prisma.cafeBean.create({data: data});
  return cafeBeanId;
}

export const getCafeBean = async (data) => {
  const cafeBean = await prisma.cafeBean.findFirst({where: {cafe_id: data.cafe_id, bean_id: data.bean_id}});
  if(!cafeBean){
    return null;
  }
  return cafeBean;
}