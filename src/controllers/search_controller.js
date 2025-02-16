import SearchService from '../services/search_service.js';
import SearchRepository from '../repositories/search_repository.js';
import { InternalServerError, NotFoundError } from '../error/error.js';

const searchRepository = new SearchRepository();
const service = new SearchService(searchRepository);

class SearchController {
    async searchByKeyword(req, res, next) {
        const user_id = Number(req.user_id);
        const { keyword } = req.query;
        const lat = Number(req.query.lat);
        const lng = Number(req.query.lng);
        const radius = Number(req.query.radius);
        
        if (!user_id || isNaN(user_id)) {
            return res.status(400).json({ message: '유저 아이디는 필수이며 숫자여야 합니다.' });
        }

        if (!keyword || keyword.trim().length === 0) {
            return res.status(400).json({ message: '검색어는 필수입니다.' });
        }

        if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({ message: '위도와 경도는 필수이며 숫자여야 합니다.' });
        }
    
        if (!radius || isNaN(radius)) {
            return res.status(400).json({ message: '반경은 필수이며 숫자여야 합니다.' });
        }

        try {
            const result = await service.searchCafes(user_id, keyword, lat, lng, radius);
            return res.status(200).json({
                message: '검색 완료',
                term : keyword,
                list : result,
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

    async getTopSearchTerms(req, res, next) {
        const { untilTime } = req.query;

        const time = new Date(untilTime);
        if (isNaN(time)) {
            return res.status(400).json({ message: '시간은 필수이며 YYYY-MM-DD HH:mm:ss 형식입니다.' });
        }

        try {
            const topSearchTerms = await service.topSearchTerms(time);
        
            return res.status(200).json({
                message: '인기 검색어 6개 반환 완료',
                terms: topSearchTerms,
                untilTime: time,
            });
        } catch (error) {
            if (error instanceof InternalServerError) {
                console.error(error.message);
                return res.status(500).json({ message: error.message });
            }

            return res.status(500).json({ message: '알 수 없는 에러', error: error.message });
        }
    }

    async getRecentTerms(req, res, next) {
        const user_id = Number(req.user_id);

        if (!user_id || isNaN(user_id)) {
            return res.status(400).json({ message: '유저아이디는 필수이며 숫자여야 합니다.' });
        }

        try {
            const recentSearches = await service.recentTerms(user_id);
            return res.status(200).json({
                message: '유저별 최근 검색어 10개 반환 완료',
                terms: recentSearches,
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

    async deleteSearchTerm(req, res, next) {
        const user_id = Number(req.user_id);
        const { keyword } = req.query;

        if (!user_id || isNaN(user_id)) {
            return res.status(400).json({ message: '유저아이디는 필수이며 숫자여야 합니다.' });
        }

        if (!keyword || keyword.trim().length === 0) {
            return res.status(400).json({ message: '검색어는 필수입니다.' });
        }
    
        try {
            const result = await service.deleteRecentSearch(user_id, keyword);
            return res.status(200).json({
                message: '유저별 최근 검색어 삭제 완료 (1개)',
                deleteTerm: result,
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
    
    async deleteAllSearchTerms(req, res, next) {
        const user_id = Number(req.user_id);

        if (!user_id || isNaN(user_id)) {
            return res.status(400).json({ message: '유저아이디는 필수이며 숫자여야 합니다.' });
        }
    
        try {
            const result = await service.deleteAllRecentSearches(user_id);
            return res.status(200).json({
                message: '유저별 최근 검색어 삭제 완료 (전체)',
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

export default SearchController;