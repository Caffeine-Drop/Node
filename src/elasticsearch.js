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

export async function syncCafesToElasticsearch() {
    try {
      // MySQL에서 모든 카페 데이터 가져오기
      const cafes = await prisma.cafe.findMany();
  
      if (cafes.length === 0) {
        console.log('No cafes found to sync.');
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
        console.log(`Synced cafe: ${cafe.name}`);
      }
  
      console.log('ElasticSearch sync completed successfully!');
    } catch (error) {
      console.error('Error during ElasticSearch sync:', error);
    }
}