import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

// 유저 정보를 조회하는 함수
export const getUser = async (userId) => {
    const user = await prisma.User.findFirst( { where: { user_id: userId} } );
    if (!user) {
        return null;
    }
    
    return user;
}

// 유저 선호원두 추가하는 함수
export const addPreferredBean = async (data) => {
    const result = await prisma.PreferedUserBean.create({data: data});
    return result.roasting_id;
}