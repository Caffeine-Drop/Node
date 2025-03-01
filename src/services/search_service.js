import { InternalServerError, NotFoundError } from '../error/error.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class SearchService {
    constructor(searchRepository) {
        this.searchRepository = searchRepository;
    }
    
    // 카페 검색
    async searchCafes(userId, keyword, lat, lng, radius) {         
        try {
            console.log(userId, keyword, lat, lng, radius);

            const user = await prisma.user.findFirst({ where: { user_id: userId } });
            if (!user) {
                throw new NotFoundError({ message: '유저가 존재하지 않습니다.' });
            }

            this.searchRepository.incrementSearchCount(keyword); // 키워드 카운트 증가
            this.searchRepository.saveRecentSearch(userId, keyword); // 최근 검색어 저장
            const cafes = this.searchRepository.searchCafesByKeyword(keyword, lat, lng, radius); // 키워드로 검색

            return cafes;
        } catch (error) {
            throw new InternalServerError("검색 중 에러가 발생했습니다.");   
        }
    }

    // 인기 단어 6개
    async topSearchTerms(untilTime) {
        try {            
            const topSearchTerms = await this.searchRepository.topSearchTerms(untilTime); // 6개 반환
            return topSearchTerms;
        } catch (error) {
            throw new InternalServerError("인기 순위를 불러오는 중 에러가 발생했습니다.");   
        }
    }

    // 최근 검색어 10개
    async recentTerms(userId) {
        const user = await prisma.user.findFirst({ where: { user_id: userId } });
        if (!user) {
            throw new NotFoundError({ message: '유저가 존재하지 않습니다.' });
        }

        try {
            const recentSearches = await this.searchRepository.termsOfuser(userId); // 10개 반환
            return recentSearches;
        } catch (error) {
            console.error("최근 검색어를 가져오는 중 오류 발생:", error);

            throw new InternalServerError('최근 검색어를 가져오는 중 오류가 발생했습니다.');
        }
    }

    // 검색어 삭제 1개
    async deleteRecentSearch(userId, term) {
        const user = await prisma.user.findFirst({ where: { user_id: userId } });
        if (!user) {
            throw new NotFoundError({ message: '유저가 존재하지 않습니다.' });
        }

        const existingSearch = await prisma.recentSearch.findFirst({ where: { user_id : userId, search_term : term }})
        if (!existingSearch) {
            throw new NotFoundError({ message: `"${term}" 검색어가 존재하지 않습니다.` });
        }

        try {
          await this.searchRepository.deleteRecentSearchByTerm(userId, term);
          return term;
        } catch (error) {
          throw new InternalServerError('검색어 삭제 중 오류가 발생했습니다.');
        }
    }

    // 검색어 삭제 전체
    async deleteAllRecentSearches(userId) {
        const user = await prisma.user.findFirst({ where: { user_id: userId } });
        if (!user) {
            throw new NotFoundError({ message: '유저가 존재하지 않습니다.' });
        }
        
        try {
            await this.searchRepository.deleteAllRecentSearches(userId);
        } catch (error) {
            throw new InternalServerError('모든 검색어 삭제 중 오류가 발생했습니다.');
        }
    }
}

export default SearchService;