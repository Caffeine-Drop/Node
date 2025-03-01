import * as Error from '../error/error.js';
import { getUser } from '../repositories/user_repository.js';
import { getRoasting } from '../repositories/roasting_repository.js';
import { getPreferredBean, getPreference, addPreferredBean, deletePreferredBean } from '../repositories/preference_repository.js';

// 선호원두 추가 서비스
export const makePreferredBean = async (data) => {
  try {
    const comfirm1 = await getUser(data.user_id);
    const comfirm2 = await getRoasting(data.roasting_id);
    if (!comfirm1 || !comfirm2) {
      throw new Error.NotFoundError((comfirm1 ? "로스팅 정보" : "유저") + "를 찾을 수 없습니다.");
    }
    const result = await addPreferredBean(data);
    return result;
  } catch (err) {
    if (err instanceof Error.AppError) {
      throw err;
    } else {
      throw new Error.InternalServerError();
    }
  }
}

// 선호원두 조회 서비스
export const findPreferredBean = async (userId) => {
  try {
    const comfirm = await getUser(userId);
    if (!comfirm) {
      throw new Error.NotFoundError("유저를 찾을 수 없습니다.");
    }
    const result = await getPreferredBean(userId)
    if (result.length === 0) {
      throw new Error.NotFoundError("해당 유저는 아직 선호 원두를 생성하지 않았습니다.");
    }
    return result;
  } catch (err) {
    if (err instanceof Error.AppError) {
      throw err;
    } else {
      throw new Error.InternalServerError();
    }
  }
}

// 선호원두 삭제 서비스
export const deleteUserPreference = async (user_id) => {
  try {
    const preference = (await getPreference(String(user_id))).map((preference) => preference.prefered_id);
    const result = await deletePreferredBean(preference);
    return result;
  } catch (err) {
    console.log(err);
    if (err instanceof Error.AppError) {
      throw err;
    } else {
      throw new Error.InternalServerError();
    }
  }
}