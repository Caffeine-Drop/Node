import { getBean } from '../repositories/bean_repository.js';
import { getSingleOriginDetail } from '../repositories/bean_repository.js';
import { getTagsID, getTags } from '../repositories/bean_repository.js';
import * as Error from '../error/error.js';

export const findBeanByID = async(beanId) => {
  try{
    const bean = await getBean(beanId);
    if(!bean){
      throw new Error.NotFoundError("원두를 찾을 수 없습니다.");
    }
    const singleOrigin = await getSingleOriginDetail([beanId]);
    const tags = await getTagsID([beanId]);
    const tagList = await getTags(tags.map((tag) => tag.cuffing_tag_id));

    return {bean: bean, single_origin: singleOrigin, cuffingTag: tagList};
  }catch(err){
    if(err instanceof Error.AppError){
      throw err;
    }else{
      throw new Error.InternalServerError();
    }
  }
}