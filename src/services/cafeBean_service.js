import * as Error from '../error/error.js';
import { addCafeBean, getCafeBeanByKey, getBeansByCafeID } from '../repositories/cafebean_repository.js';
import { getCafe } from '../repositories/cafe_repository.js';
import { getBean, getBeansDetails, getSingleOriginDetail, getSingleOriginID, getTags, getTagsID } from '../repositories/bean_repository.js';

// 카페 보유원두 추가 서비스
export const makeCafeBean = async (data) => {
  try {
    const comfirm1 = await getCafe(data.cafe_id);
    const comfirm2 = await getBean(data.bean_id);
    const comfirm3 = await getCafeBeanByKey(data);
    // 요청 데이터 존재여부 확인
    if (!comfirm1 || !comfirm2) {
      throw new Error.NotFoundError((comfirm1 ? "원두" : "카페") + "를 찾을 수 없습니다.");
    }
    // 이미 등록된 데이터인지 확인
    if (comfirm3) {
      throw new Error.ValidationError("이미 등록된 카페와 원두입니다.");
    }
        
    // 데이터베이스에 추가
    const result = await addCafeBean(data);
    return result;

  } catch (err) {
    if (err instanceof Error.AppError) {
      throw err;
    } else {
      throw new Error.InternalServerError();
    }
  }
}

// // 카페 원두 상세조회 서비스
// export const getAllOfBeans = async (cafe_id) => {
//   try {
//     const comfirm = await getCafe(cafe_id);
//     // 카페 존재여부 확인
//     if (!comfirm) {
//       throw new Error.NotFoundError("카페를 찾을 수 없습니다.");
//     }

//     const beanIDs = (await getBeansByCafeID(cafe_id)).map((bean) => bean.bean_id); // 보유원두 id 리스트
//     const singleIDs = (await getSingleOriginID(beanIDs)).map((single) => single.bean_id); // 싱글오리진 원두 id 리스트
  
//     const [beansDetail, tagIDs, singleDetails] = await Promise.all([
//       getBeansDetails(beanIDs),   // 보유원두 상세정보
//       getTagsID(beanIDs),         // 원두와 관계된 태그 아이디
//       getSingleOriginDetail(singleIDs) // 싱글오리진 상세정보
//     ]);
//     const cuffingTag = await getTags(tagIDs.map((tag => tag.cuffing_tag_id))); // 커핑 태그 정보

//     return { bean: beansDetail, single_origin: singleDetails, bean_tag: tagIDs, cuffingTag: cuffingTag };

//   } catch (err) {
//     if (err instanceof Error.AppError) {
//       throw err;
//     } else {
//       throw new Error.InternalServerError();
//     }
//   }
// }

export const getAllOfBeans = async (cafe_id) => {
  try {
    const comfirm = await getCafe(cafe_id);
    if (!comfirm) {
      throw new Error.NotFoundError("카페를 찾을 수 없습니다.");
    }

    const beanIDs = (await getBeansByCafeID(cafe_id))?.map((bean) => bean.bean_id) || [];
    const singleIDs = (await getSingleOriginID(beanIDs))?.map((single) => single.bean_id) || [];

    const [beansDetail, tagIDs, singleDetails] = await Promise.all([
      getBeansDetails(beanIDs).catch(() => []),
      getTagsID(beanIDs).catch(() => []),
      getSingleOriginDetail(singleIDs).catch(() => [])
    ]);

    if (!beansDetail || beansDetail.length === 0) {
      throw new Error.NotFoundError("보유 원두의 상세 정보를 찾을 수 없습니다.");
    }

    if (!tagIDs || tagIDs.length === 0) {
      throw new Error.NotFoundError("태그 정보를 찾을 수 없습니다.");
    }

    if (!singleDetails || singleDetails.length === 0) {
      throw new Error.NotFoundError("싱글 오리진 원두 정보를 찾을 수 없습니다.");
    }

    const cuffingTag = await getTags(tagIDs.map((tag) => tag.cuffing_tag_id));
    if (!cuffingTag || cuffingTag.length === 0) {
      throw new Error.NotFoundError("커핑 태그를 찾을 수 없습니다.");
    }

    return { bean: beansDetail, single_origin: singleDetails, bean_tag: tagIDs, cuffingTag };
  } catch (err) {
    if (err instanceof Error.AppError) {
      throw err;
    } else {
      throw new Error.InternalServerError();
    }
  }
};


// 스페셜티 인증 커피 보유여부 서비스
export const isSpecial = async (cafe_id) => {
  try {
    const comfirm = await getCafe(cafe_id);
    // 카페 존재여부 확인
    if (!comfirm) {
      throw new Error.NotFoundError("카페를 찾을 수 없습니다.");
    }

    const beans = await getBeansByCafeID(cafe_id);    // 보유원두 id 리스트
    const result = await getSingleOriginID(beans.map((bean) => bean.bean_id)); // 싱글오리진 원두 id 리스트

    return result.length == 0 ? false : true;
  } catch (err) {
    if (err instanceof Error.AppError) {
      throw err;
    } else {
      throw new Error.InternalServerError();
    }
  }
}