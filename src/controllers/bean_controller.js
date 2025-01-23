import { findBeanByID } from "../services/bean_service.js";

// 원두 상세조회 API
export const getBeanDetail = async (req, res, next) => {
  //요청 파라미터 확인
  console.log("body:", req.body, "\nparams:", req.params, "\nquery:", req.query);

  try {
    const bean = await findBeanByID(Number(req.params.bean_id));

    // 성공적인 응답 반환
    res.status(200).success(bean);
  } catch (err) {
    next(err);
  }
};
