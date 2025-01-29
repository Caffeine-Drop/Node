import { makeCafeBean, getBeans, getAllOfBeans, isSpecial} from "../services/cafe_service.js";
import { cafeBeanDto } from "../dtos/cafebean_dto.js";

export const handleCafeBean = async (req, res, next) => {
  //요청 파라미터 확인
  console.log("body:", req.body, "\nparams:", req.params, "\nquery:", req.query);
  try{
    const cafebean = await makeCafeBean(cafeBeanDto(req.params));
    res.status(200).success(cafebean);
  }catch(err){
    next(err);
  }
}

export const getCafeBeans = async (req, res, next) => {
  try{
    const beans = await getBeans(Number(req.params.cafe_id));
    res.status(200).success(beans);
  }catch(err){
    next(err);
  }
}

export const getCafeBeansDetails = async (req, res, next) => {
  //요청 파라미터 확인
  console.log("body:", req.body, "\nparams:", req.params, "\nquery:", req.query);
  try{
    const beans = await getAllOfBeans(Number(req.params.cafe_id));
    res.status(200).success(beans);
  }catch(err){
    next(err);
  }
}

export const hasSpecialTea = async (req, res, next) => {
  //요청 파라미터 확인
  console.log("body:", req.body, "\nparams:", req.params, "\nquery:", req.query);
  try{
    const result = await isSpecial(Number(req.params.cafe_id));
    res.status(200).success(result);
  }catch(err){
    next(err);
  }
}
