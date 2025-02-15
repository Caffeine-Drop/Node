import { makePreferredBean, findPreferredBean, deleteUserPreference } from '../services/preference_service.js';
import { responseToPreffedBean } from '../dtos/bean_dto.js';
import * as Error from '../error/error.js';

// 선호원두 추가 컨트롤러
export const handlePreferredBean = async(req, res, next) => {
  try {
    const preferredBean = await makePreferredBean(responseToPreffedBean({ params: req.user_id, body: req.body }));
    res.status(200).success(preferredBean);
  } catch (err) {
    if(err instanceof Error.NotFoundError){
      res.error(err, 404);
    }else if(err instanceof Error.InternalServerError){
      res.error(err, 500);
    }else{
      next(err);
    }
  }
}

// 선호원두 조회 컨트롤러
export const getPreferredBeanDetail = async(req, res, next) => {
  try {
    const preferredBean = await findPreferredBean(String(req.user_id));
    res.status(200).success(preferredBean);
  } catch (err) {
    if(err instanceof Error.NotFoundError){
      res.error(err, 404);
    }else if(err instanceof Error.InternalServerError){
      res.error(err, 500);
    }else{
      next(err);
    }
  }
}

// 선호원두 삭제 컨트롤러
export const removePreferredBean = async(req, res, next) => {
  try {
    const preferredBean = await deleteUserPreference({user_id: req.user_id,prefered_id: Number(req.params.prefered_id)});
    console.log(preferredBean);
    res.status(200).success(preferredBean);
  } catch (err) {
    if(err instanceof Error.NotFoundError){
      res.error(err, 404);
    }else if(err instanceof Error.ForbiddenError){
      res.error(err, 403);
    }else if(err instanceof Error.InternalServerError){
      res.error(err, 500);
    }else{
      next(err);
    }
  }
}