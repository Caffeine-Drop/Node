import searchService from '../services/search_service';
import searchRepository from '../repositories/search_repository.js';
import cafeRepository from '../repositories/cafe_repository.js';
import { InternalServerError } from '../error/error.js';

const service = new searchService(searchRepository, cafeRepository);

class searchController {
    async searchByKeyword(req, res, next) {
        const { user_id } = req.params;
        const { keyword } = req.query;
        
        if (!keyword) {
            return res.status(400).json({ message: '키워드가 입력되지 않았습니다.' });
        }

        try {
            const result = await service.searchCafes(user_id, keyword);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof InternalServerError) {
                console.error(error.message);
                return res.status(500).json({ message: error.message });
            }

            return res.status(500).json({ message: '알 수 없는 에러', error: error.message });
        }
      }
}

export default searchController;