import { makeCafeBean, getAllOfBeans, isSpecial} from "../services/cafeBean_service.js";
import { cafeBeanDto } from "../dtos/bean_dto.js";
import * as Error from '../error/error.js';
// 카페 보유원두 추가 컨트롤러
export const handleCafeBean = async (req, res, next) => {
  try{
    const cafebean = await makeCafeBean(cafeBeanDto(req.params));
    res.status(200).success(cafebean);
  }catch(err){
    if(err instanceof Error.NotFoundError){
      res.error(err, 404);
    }else if(err instanceof Error.ValidationError){
      res.error(err, 400);
    }else if(err instanceof Error.InternalServerError){
      res.error(err, 500);
    }else{
      next(err);
    }
  }
}

// 카페 원두 상세조회(전체) 컨트롤러
export const getCafeBeansDetails = async (req, res, next) => {
  try{
    const beans = await getAllOfBeans(Number(req.params.cafe_id));
    res.status(200).success(beans);
  }catch(err){
    if(err instanceof Error.NotFoundError){
      res.error(err, 404);
    }else if(err instanceof Error.InternalServerError){
      res.error(err, 500);
    }else{
      next(err);
    }
  }
}

// 스페셜티 인증 커피 보유여부 컨트롤러
export const hasSpecialTea = async (req, res, next) => {
  try{
    const result = await isSpecial(Number(req.params.cafe_id));
    res.status(200).success(result);
  }catch(err){
    if(err instanceof Error.NotFoundError){
      res.error(err, 404);
    }else if(err instanceof Error.InternalServerError){
      res.error(err, 500);
    }else{
      next(err);     
    }
  }
}
