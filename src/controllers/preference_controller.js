import { makePreferredBean, findPreferredBean, deleteUserPreference } from '../services/preference_service.js';
import { responseToPreffedBean, preferredBeanDto } from '../dtos/bean_dto.js';

// 선호원두 추가 컨트롤러
export const handlePreferredBean = async(req, res, next) => {
  try {
    const preferredBean = await makePreferredBean(responseToPreffedBean({ params: req.params, body: req.body }));
    res.status(200).success(preferredBean);
  } catch (err) {
    next(err);
  }
}

// 선호원두 조회 컨트롤러
export const getPreferredBeanDetail = async(req, res, next) => {
  try {
    const preferredBean = await findPreferredBean(Number(req.params.user_id));
    res.status(200).success(preferredBean);
  } catch (err) {
    next(err);
  }
}

// 선호원두 삭제 컨트롤러
export const removePreferredBean = async(req, res, next) => {
  try {
    const preferredBean = await deleteUserPreference(preferredBeanDto(req.params));
    console.log(preferredBean);
    res.status(200).success(preferredBean);
  } catch (err) {
    next(err);
  }
}