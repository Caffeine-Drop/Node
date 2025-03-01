import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class LikeRepository {
    // 유저 별 카페 좋아요 등록
    // 이미 유저-카페 좋아요 관계가 있다면 삭제, 없다면 생성
    async likeCafe(userId, cafeId) {
        const existingLike = await prisma.cafeLike.findFirst({
            where: {
                user_id: userId,
                cafe_id: cafeId,
            }
        });

        if (existingLike) {
            await prisma.cafeLike.delete({
                where: {
                    user_id_cafe_id: { user_id: userId, cafe_id: cafeId }
                }
            });
            return { message: "좋아요 삭제" };
        } else {
            await prisma.cafeLike.create({
                data: {
                    user_id: userId,
                    cafe_id: cafeId
                }
            });
            return { message: "좋아요 등록" };
        }
    }

    async mycafe(userId) {
        return await prisma.cafeLike.findMany({
            where: { user_id: userId },
            include: {
                cafe: {  // Cafe와 관련된 모든 정보 포함
                    include: {
                        images: true,
                        menu_items: true,
                        reviews: true,
                        likes: true,
                        beans: true,
                        filters: {
                            include: {
                                filter_criteria: true,
                            }
                        },
                        operating_hours: true,
                    }
                }
            }
        });
    }
}

export default LikeRepository;