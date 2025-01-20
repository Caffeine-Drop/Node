import { InternalServerError } from '../error/error.js';

class searchService {
    constructor(searchRepository) {
        this.searchRepository = searchRepository;
    }
    
    // 카페 검색
    async searchCafes(user_id, keyword) {   
        try {
            const cafes = await this.searchRepository.searchCafesByKeyword(keyword);
            await this.searchRepository.incrementSearchCount(keyword);
            await this.searchRepository.saveRecentSearch(user_id, keyword);

            const cafeResponseDTOs = cafes.map(cafe => new CafeResponseDTO(
                cafe.name,
                cafe.latitude,
                cafe.longitude,
                cafe.address,
                cafe.operatingHours,
                cafe.images,
                cafe.likes,
                cafe.reviewRate,
                cafe.reviewCount,
                cafe.specialty
            ));

            return cafeResponseDTOs;
        } catch (error) {
            throw new InternalServerError("카페 검색 중 에러가 발생했습니다.");   
        }
    }
}

export default searchService;