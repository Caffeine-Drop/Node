import { InternalServerError, NotFoundError } from "../error/error.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class LikeService {
	constructor(likeRepository) {
		this.likeRepository = likeRepository;
	}

	// 유저별 카페 좋아요 등록
	async likeForCafe(userId, cafeId) {
		const user = await prisma.user.findFirst({ where: { user_id: userId } });
		if (!user) {
			throw new NotFoundError({ message: "유저가 존재하지 않습니다." });
		}

		const cafe = await prisma.cafe.findFirst({ where: { cafe_id: cafeId } });
		if (!cafe) {
			throw new NotFoundError({ message: "카페가 존재하지 않습니다." });
		}

		try {
			await this.likeRepository.likeCafe(userId, cafeId);
		} catch (error) {
			console.error("카페 좋아요 하는 중 오류 발생:", error);

			throw new InternalServerError("카페 좋아요 하는 중 오류가 발생했습니다.");
		}
	}
}

export default LikeService;
