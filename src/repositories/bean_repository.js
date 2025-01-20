import {prisma} from './prisma.js';

export const getBean = async (beanId) => {
  const bean = await prisma.Bean.findFirst( { where: { bean_id: beanId} } );
  if (!bean) {
    return null;
  }
  
  return bean;
}

