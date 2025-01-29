import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

// 원두 정보 조회 함수 (단일)
export const getBean = async (beanId) => {
  const bean = await prisma.Bean.findFirst( { where: { bean_id: beanId} } );
  if (!bean) {
    return null;
  }
  return bean;
}

// 원두 정보 조회 함수 (다중)
export const getBeansDetails = async (beanIds) => {
  const beans = await prisma.Bean.findMany( { where: { bean_id: { in: beanIds } } } );
  return beans;
}

// 로스팅 정보 조회 함수
export const getRoasting = async (roastingId) => {
  const roasting = await prisma.Roasting.findFirst( { where: { roasting_id: roastingId} } );
  if (!roasting) {
    return null;
  }
  
  return roasting;
}

// 원두들 중 싱글오리진인 원두 아이디만 반환하는 함수
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

// 원두들의 싱글오리진 정보를 가져오는 함수
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

// 원두들과 관계된 태그 아이디를 가져오는 함수
export const getTagsID = async (beanIds) => {
  const tags = await prisma.CuffingTagBean.findMany( { 
      where: { bean_id: { in: beanIds } }
    });
  return tags;
}

// 태그 아이디들의 정보를 가져오는 함수
export const getTags = async (tagIds) => {
  const tags = await prisma.CuffingTag.findMany( { 
      where: { cuffing_tag_id: { in: tagIds } },
      distinct: ['cuffing_tag_id']
    });
  return tags;
}