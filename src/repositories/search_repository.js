import prisma from '../../prisma/schema.prisma';
import { elasticsearchClient } from '../elasticsearch';

class SearchRepository {
  // 단어별 검색 수 증가
  static async incrementSearchCount(keyword) {
    const existingTerm = await prisma.searchTerm.findUnique({
      where: { term: keyword },
    });

    if (existingTerm) {
      await prisma.searchTerm.update({
        where: { term: keyword },
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
  }

  // 유저별 최근 검색어 저장
  static async saveRecentSearch(user_id, keyword) {
    await prisma.recentSearch.create({
      data: {
        user_id: parseInt(user_id),
        search_term: keyword,
        searched_at: new Date(),
      },
    });
  }

  // 키워드로 검색
  async searchCafesByKeyword(keyword) {
    const result = await elasticsearchClient.search({
      index: 'cafes',
      body: {
        query: {
          multi_match: {
            query: keyword,
            fields: ['name', 'menu_items', 'address'],
          },
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source);
  }
}

export { SearchRepository };