import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

// 선호원두 추가하는 함수
export const addPreferredBean = async (data) => {
  const result = await prisma.PreferedUserBean.create({ data: data });
  return result;
}

// 선호원두 조회하는 함수 (유저아이디로 다중조회)
export const getPreferredBean = async (userId) => {
  const beans = await prisma.PreferedUserBean.findMany({ where: { user_id: userId } });
  return beans;
}

// 선호원두 조회하는 함수 (선호원두아이디로 단일조회)
export const getPreference = async (user_id) => {
  const beans = await prisma.PreferedUserBean.findMany({ 
    where: { user_id: user_id },
    select: {prefered_id: true}
  });
  if (!beans) {
    return null;
  }
  return beans;
}

// 선호원두 삭제하는 함수
export const deletePreferredBean = async (prefered_ids) => {
  const intPreferedIds = prefered_ids.map(id => Number(id));
  const result = await prisma.PreferedUserBean.deleteMany({ where: { prefered_id: { in: intPreferedIds } }});
  return result;
}