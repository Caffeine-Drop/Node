import { Client } from '@elastic/elasticsearch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const elasticsearchClient = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: 'elastic',
    password: '1234',
  },
});

export default async function syncCafesToElasticsearch() {
    try {
      // MySQL에서 모든 카페 데이터 가져오기
      const cafes = await prisma.cafe.findMany();
  
      if (cafes.length === 0) {
        return;
      }
  
      // ElasticSearch에 동기화
      for (const cafe of cafes) {
        await elasticsearchClient.index({
          index: 'cafes',
          id: cafe.id.toString(),
          body: {
            name: cafe.name,
            menu_items: cafe.menu_items,
            address: cafe.address,
          },
        });
      }
  
      console.log('엘라스틱서치 동기화 성공');
    } catch (error) {
      console.error('엘라스틱서치 동기화 중 에러 : ', error);
    }
}