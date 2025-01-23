
import * as Error from '../error/error.js';
import { addCafeBean, getCafeBeanByKey, getBeansByCafeID } from '../repositories/cafebean_repository.js';
import { getCafe } from '../repositories/cafe_repository.js';
import { getBean, getBeansWithName, getSpecialTea } from '../repositories/bean_repository.js';

// data: {cafe_id, bean_id}
export const makeCafeBean = async (data) => {
  try {
    const comfirm1 = await getCafe(data.cafe_id);
    const comfirm2 = await getBean(data.bean_id);
    const comfirm3 = await getCafeBeanByKey(data);
    // 데이터 존재여부 확인
    if(!comfirm1 || !comfirm2){
      throw new Error.NotFoundError((comfirm1 ? "원두" : "카페") + "를 찾을 수 없습니다.");
    }
    // 이미 등록된 데이터인지 확인
    if(comfirm3){
      throw new Error.ValidationError("이미 등록된 카페와 원두입니다.");
    }
        
    const result = await addCafeBean(data);
    return result;

  } catch (err) {
    if(err instanceof Error.AppError){
      throw err;
    }else{
      throw new Error.InternalServerError();
    }
  }
}

export const getBeans = async (cafe_id) => {
  try {
    const comfirm = await getCafe(cafe_id);
    // 카페 존재여부 확인
    if(!comfirm){
      throw new Error.NotFoundError("카페를 찾을 수 없습니다.");
    }

    const beans = await getBeansByCafeID(cafe_id);
    const result = await getBeansWithName(beans.map((bean) => bean.bean_id));  
    return result;

  } catch (err) {
    if(err instanceof Error.AppError){
      throw err;
    }else{
      throw new Error.InternalServerError();
    }
  }
}

export const isSpecial = async (cafe_id) => {
  try {
    const comfirm = await getCafe(cafe_id);
    // 카페 존재여부 확인
    if(!comfirm){
      throw new Error.NotFoundError("카페를 찾을 수 없습니다.");
    }

    const beans = await getBeansByCafeID(cafe_id);
    console.log(beans);
    const result = await getSpecialTea(beans.map((bean) => bean.bean_id));
    console.log(result);
    return result.length==0 ? false : true;
  } catch (err) {
    if(err instanceof Error.AppError){
      throw err;
    }else{
      throw new Error.InternalServerError();
    }
  }
}