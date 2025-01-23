import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

export const getBean = async (beanId) => {
  const bean = await prisma.Bean.findFirst( { where: { bean_id: beanId} } );
  if (!bean) {
    return null;
  }
  
  return bean;
}

export const getBeansWithName = async (beanIds) => {
  const beans = await prisma.Bean.findMany( 
    { 
      where: { bean_id: { in: beanIds } },
      select: { name: true, bean_id: true }
    } 
  );
  return beans;
}

export const getSpecialTea = async (beanIds) => {
  const beans = await prisma.Bean.findMany({
      where: { 
        bean_id: { in: beanIds },
        is_specialty: true 
      },
      select: { bean_id: true }
    });
  if (!beans) {
    return null;
  }
  return beans;
}