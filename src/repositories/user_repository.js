import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

export const getUser = async (userId) => {
    const user = await prisma.User.findFirst( { where: { user_id: userId} } );
    if (!user) {
        return null;
    }
    
    return user;
}

export const addPreferredBean = async (data) => {
    const result = await prisma.PreferedUserBean.create({data: data});
    return result.roasting_id;
}