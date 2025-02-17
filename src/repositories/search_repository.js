import { elasticsearchClient } from '../middlewares/elasticsearch.js';
import { PrismaClient } from '@prisma/client';
import CafeResponseDTO from '../dtos/search_dto.js';
const prisma = new PrismaClient();

class SearchRepository {
  // 단어별 검색 수 증가
  // 단어가 없다면 생성 후 추가, 있다면 증가
  async incrementSearchCount(keyword) {
    console.log("단어 수 증가", keyword);
    const existingTerm = await prisma.searchTerm.findFirst({
      where: { term: keyword },
    });

    if (existingTerm) {
      await prisma.searchTerm.update({
        where: { search_term_id: existingTerm.search_term_id },
        data: {
          search_count: existingTerm.search_count ? existingTerm.search_count + 1 : 1,
          last_searched_at: new Date(),
        },
      });
    } else {
      await prisma.searchTerm.create({
        data: {
          term: keyword,
          search_count: 1,
        },
      });
    }

    console.log(`${keyword} 증가 완료`);
  }

  // 유저별 최근 검색어 저장
  async saveRecentSearch(user_id, keyword) {
    console.log("최근 검색어", user_id, keyword);

    // 기존 검색어가 있는지 확인
    const existingSearch = await prisma.recentSearch.findFirst({
      where: {
        user_id: user_id,
        search_term: keyword,
      },
    });

    if (existingSearch) {
      // 기존 검색어가 있다면 시간 업데이트
      await prisma.recentSearch.update({
          where: {
            recent_search_id: existingSearch.recent_search_id,
          },
          data: {
            searched_at: new Date(),
          },
      });
    } else {
    // 기존 검색어가 없다면 새로 추가
      await prisma.recentSearch.create({
          data: {
              user_id: user_id,
              search_term: keyword,
              searched_at: new Date(),
          },
      });
    }
    console.log(`${keyword} : ${user_id} / 개인 검색어 저장 완료`);
  }

  // 키워드 검색 - 한국어 최적화 및 검색 반경 설정
  async searchCafesByKeyword(keyword, lat, lng, radius) {
    console.log("엘라스틱 서치", keyword, lat, lng, radius);

    const result = await elasticsearchClient.search({
      index: 'cafes',
      body: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: keyword,
                  fields: ['name', 'menu_items', 'address'],
                  fuzziness: 'AUTO',
                },
              },
            ],
            filter: {
              geo_distance: {
                distance: `${radius}km`,
                location: {
                  lat: parseFloat(lat),
                  lon: parseFloat(lng),
                },
              },
            },
          },
        },
      },
    });

    console.log('검색 완료');

    const hits = result.hits.hits;
    if (Array.isArray(hits) && hits.length > 0) {
      const cafeResponseDTOs = hits.map(hit => {
        const cafe = hit._source;
        return new CafeResponseDTO(
          cafe.name,
          cafe.location ? cafe.location.lat : null,  // 위치 정보가 있으면 lat
          cafe.location ? cafe.location.lon : null,  // 위치 정보가 있으면 lon
          cafe.address,
          cafe.operatingHours || null,  // operatingHours가 없으면 null
          cafe.images || null,  // images가 없으면 null
          cafe.likes || 0,  // likes가 없으면 0
          cafe.reviewRate || 0,  // reviewRate가 없으면 0
          cafe.reviewCount || 0,  // reviewCount가 없으면 0
          cafe.specialty || null  // specialty가 없으면 null
        );
      });
      return cafeResponseDTOs;
    } else {
      console.log("검색된 카페가 없습니다.");
      return [];
    }
  }

  // 기준 시간 입력 시 인기 순위 6개 단어 반환
  async topSearchTerms(untilTime) {
    const time = new Date(untilTime);

    const topSearchTerms = await prisma.searchTerm.findMany({
      where: {
        last_searched_at: {
            lte: time,
        },
      },
      orderBy: {
        search_count: 'desc',
      },
      take: 6,
    });

    console.log(`인기 검색어 6개 : ${topSearchTerms}`);

    return topSearchTerms.map(item => item.term);
  }

  // 유저 별 최근 검색어 10개 반환
  async termsOfuser(userId) {
    const recentSearches = await prisma.recentSearch.findMany({
        where: {
            user_id: userId,
        },
        orderBy: {
            searched_at: 'desc',
        },
        take: 10,
    });

    console.log(`개인 검색어 10개 : ${recentSearches} of ${userId}`);
    
    return recentSearches.map(item => item.search_term);
  }

  // 유저의 특정 단어 최근 검색어에서 삭제
  async deleteRecentSearchByTerm(userId, term) {
    await prisma.recentSearch.deleteMany({
      where: {
        user_id: userId,
        search_term: term,
      },
    });
    console.log(`${userId} : "${term}" 검색어 삭제 완료`);
  }

  // 유저의 전체 단어 최근 검색어에서 삭제
  async deleteAllRecentSearches(userId) {
    await prisma.recentSearch.deleteMany({
      where: {
        user_id: userId,
      },
    });
    console.log(`${userId} 모든 검색어 삭제 완료`);
  }
}

export default SearchRepository;