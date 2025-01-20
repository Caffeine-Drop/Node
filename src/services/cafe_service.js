
import * as Error from '../error/error.js';
import { addCafeBean, getCafeBean } from '../repositories/cafebean_repository.js';
import { getCafe } from '../repositories/cafe_repository.js';
import { getBean } from '../repositories/bean_repository.js';

// data: {cafe_id, bean_id}
export const makeCafeBean = async (data) => {
  try {
    const comfirm1 = await getCafe(data.cafe_id);
    const comfirm2 = await getBean(data.bean_id);
    const comfirm3 = await getCafeBean(data);
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
    console.log(err);
    if(err instanceof Error.AppError){
      throw err;
    }else{
      throw new Error.InternalServerError();
    }
  }
}