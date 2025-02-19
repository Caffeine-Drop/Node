import { InternalServerError, NotFoundError } from "../error/error.js";
import { CafeDto } from '../dtos/cafe_dto.js';
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
			const like = await this.likeRepository.likeCafe(userId, cafeId);
			return like;
		} catch (error) {
			console.error("카페 좋아요 하는 중 오류 발생:", error);

			throw new InternalServerError("카페 좋아요 하는 중 오류가 발생했습니다.");
		}
	}

	async myLikeCafe(userId) {
		const user = await prisma.user.findFirst({ where: { user_id: userId } });
		if (!user) {
			throw new NotFoundError({ message: "유저가 존재하지 않습니다." });
		}

		try {
			// 좋아요한 카페 가져오기
			const like = await this.likeRepository.mycafe(userId);

			// CafeDto 형식으로 변환
			const cafeDtos = await Promise.all(
				like.map(async (cafe) => {
					const cafeDetails = await prisma.cafe.findUnique({
						where: { cafe_id: cafe.cafe_id },
						include: {
							images: true,
							menu_items: true,
							reviews: true,
							likes: true,
							beans: true,
							filters: true,
							operating_hours: true,
						},
					});
	
					return new CafeDto(cafeDetails); // CafeDto로 변환하여 반환
				})
			);
	
			return cafeDtos;
		} catch (error) {
			throw new InternalServerError("좋아요 한 카페를 가져오는 중 오류가 발생했습니다.");
		}
	}
}

export default LikeService;
