import { findBeanByID } from "../services/bean_service.js";

// 원두 상세조회 API
export const getBeanDetail = async (req, res, next) => {
  try {
    const bean = await findBeanByID(Number(req.params.bean_id));
    res.status(200).success(bean);
  } catch (err) {
    next(err);
  }
};
