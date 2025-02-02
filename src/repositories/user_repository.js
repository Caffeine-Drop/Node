import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

// 유저 정보를 조회하는 함수
export const getUser = async (userId) => {
    const user = await prisma.user.findUnique( { where: { user_id: userId} } );
    if (!user) {
        return null;
    }
    
    return user;
}