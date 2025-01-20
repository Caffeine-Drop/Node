import prisma from '../../prisma';

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
  static async searchCafesByKeyword(keyword) {
    return prisma.cafe.findMany({
      where: {
        OR: [
          { name: { contains: keyword, mode: 'insensitive' } },
          { menu_items: { some: { name: { contains: keyword, mode: 'insensitive' } } } },
          { address: { contains: keyword, mode: 'insensitive' } },
        ],
      },
    });
  }
}

export { SearchRepository };