import { getBean } from '../repositories/bean_repository.js';
import * as Error from '../error/error.js';

export const findBeanByID = async(beanId) => {
  try{
    const bean = await getBean(beanId);

    if(!bean){
      throw new Error.NotFoundError("원두를 찾을 수 없습니다.");
    }
    return bean;
  }catch(err){
    throw err;
  }
}