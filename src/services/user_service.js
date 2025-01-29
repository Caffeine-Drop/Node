import * as Error from '../error/error.js';
import { getUser, addPreferredBean } from '../repositories/user_repository.js';
import { getRoasting } from '../repositories/bean_repository.js';

export const makePreferredBean = async (data) => {
    try{
        const comfirm1 = await getUser(data.user_id);
        const comfirm2 = await getRoasting(data.roasting_id);
        if(!comfirm1 || !comfirm2){
            throw new Error.NotFoundError((comfirm1 ? "로스팅 정보" : "유저") + "를 찾을 수 없습니다.");
        }
        const result = await addPreferredBean(data);
        return result;
    }catch(err){
        throw new Error.InternalServerError();
    }
}