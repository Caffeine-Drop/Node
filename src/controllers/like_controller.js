import LikeService from '../services/like_service.js';
import LikeRepository from '../repositories/like_repository.js';
import { InternalServerError, NotFoundError } from '../error/error.js';

const likeRepository = new LikeRepository();
const service = new LikeService(likeRepository);

class LikeController {
    // 카페 좋아요
    async favorCafe(req, res, next) {
        const user_id = String(req.user_id);
        const cafe_id = Number(req.params.cafe_id);


        if (!user_id) {
            return res.status(400).json({ message: '유저 아이디는 필수이며 숫자여야 합니다.' });
        }

        if (!cafe_id || isNaN(cafe_id)) {
            return res.status(400).json({ message: '카페 아이디는 필수이며 숫자여야 합니다.' });
        }

        try {
            await service.likeForCafe(user_id, cafe_id);
            return res.status(200).json({
                message: '좋아요 완료',
                user_id : user_id,
                cafe_id : cafe_id,
            });
        } catch (error) {
            if (error instanceof NotFoundError) {
                return res.status(404).json({ message: error.message });
            }

            if (error instanceof InternalServerError) {
                return res.status(500).json({ message: error.message });
            }

            return res.status(500).json({ message: '알 수 없는 에러', error: error.message });
        }
    }
}

export default LikeController;