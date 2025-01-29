import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

export const getBean = async (beanId) => {
  const bean = await prisma.Bean.findFirst( { where: { bean_id: beanId} } );
  if (!bean) {
    return null;
  }
  return bean;
}

export const getBeansDetails = async (beanIds) => {
  const beans = await prisma.Bean.findMany( { where: { bean_id: { in: beanIds } } } );
  return beans;
}

export const getRoasting = async (roastingId) => {
  const roasting = await prisma.Roasting.findFirst( { where: { roasting_id: roastingId} } );
  if (!roasting) {
    return null;
  }
  
  return roasting;
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

export const getSingleOriginID = async (beanIds) => {
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

export const getSingleOriginDetail = async (beanIds) => {
  const beans = await prisma.SingleOrigin.findMany({
      where: { 
        bean_id: { in: beanIds }
      }
    });
  if (!beans) {
    return null;
  }
  return beans;
}

export const getTagsID = async (beanIds) => {
  const tags = await prisma.CuffingTagBean.findMany( { 
      where: { bean_id: { in: beanIds } }
    });
  return tags;
}

export const getTags = async (tagIds) => {
  const tags = await prisma.CuffingTag.findMany( { 
      where: { cuffing_tag_id: { in: tagIds } },
      distinct: ['cuffing_tag_id']
    });
  return tags;
}