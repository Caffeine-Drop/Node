import { StatusCodes } from "http-status-codes";
import { makeCafeBean } from "../services/cafe_service.js";
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