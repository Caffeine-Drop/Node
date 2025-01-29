import { makePreferredBean } from '../services/user_service.js';
import { preferredBeanDto } from '../dtos/user_dto.js';

export const handlePreferredBean = async(req, res, next) => {
    console.log("body:", req.body, "\nparams:", req.params, "\nquery:", req.query);
    try{
        const preferredBean = await makePreferredBean(preferredBeanDto( { params: req.params, body: req.body } ));
        res.status(200).success(preferredBean);
    } catch(err){
        next(err);
    }
}