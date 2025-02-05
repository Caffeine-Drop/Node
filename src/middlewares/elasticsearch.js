import { Client } from '@elastic/elasticsearch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const elasticsearchClient = new Client({
  node: 'http://127.0.0.1:9200',
  auth: {
    username: 'elastic',
    password: '1234',
  },
});

// Elasticsearch 연결 확인
async function checkElasticsearchConnection() {
  try {
    const health = await elasticsearchClient.cluster.health();
    console.log('Elasticsearch 연결 상태:', health);
  } catch (error) {
    console.error('Elasticsearch 연결 실패:', error);
  }
}

export default async function syncCafesToElasticsearch() {
  try {
    await checkElasticsearchConnection();

    await elasticsearchClient.indices.exists({ index: 'cafes' })
      .then(async (exists) => {
        if (!exists.body) {
          await elasticsearchClient.indices.create({
            index: 'cafes',
          });
          console.log('Elasticsearch 인덱스 "cafes"가 생성되었습니다.');
        }
      })
      .catch((err) => {
        console.error('Elasticsearch 인덱스 존재 확인 중 에러:', err);
      });

    // MySQL에서 모든 카페 데이터 가져오기
    const cafes = await prisma.cafe.findMany();
    console.log('가져온 카페 데이터:', cafes);

    if (cafes.length === 0) {
      console.log('카페 데이터가 없습니다.');
      return;
    }

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
    console.error('엘라스틱서치 동기화 중 에러:', error);
  }
}