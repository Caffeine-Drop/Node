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

    // 인덱스 존재 여부 확인
    const indexExists = await elasticsearchClient.indices.exists({ index: 'cafes' });

    if (!indexExists.body) {
      // 인덱스가 존재하지 않으면 새로 생성
      try {
        await elasticsearchClient.indices.create({ index: 'cafes' });
        console.log('Elasticsearch 인덱스 "cafes"가 생성되었습니다.');
      } catch (err) {
        // 이미 존재하는 경우 에러 무시
        if (
          err.meta &&
          err.meta.body &&
          err.meta.body.error &&
          err.meta.body.error.type === 'resource_already_exists_exception'
        ) {
          console.log('Elasticsearch 인덱스 "cafes"가 이미 존재합니다.');
        } else {
          throw err;
        }
      }
    } else {
      console.log('Elasticsearch 인덱스 "cafes"가 이미 존재합니다.');
    }

    // MySQL에서 모든 카페 데이터 가져오기
    const cafes = await prisma.cafe.findMany();
    console.log('가져온 카페 데이터:', cafes);

    if (cafes.length === 0) {
      console.log('카페 데이터가 없습니다.');
      return;
    }

    // 각 카페 데이터를 Elasticsearch에 인덱싱
    for (const cafe of cafes) {
      try {
        // 문서가 이미 존재하면 update, 없으면 insert
        const existingDoc = await elasticsearchClient.exists({
          index: 'cafes',
          id: cafe.id.toString(),
        });

        if (existingDoc.body) {
          // 문서가 이미 존재하면 update
          await elasticsearchClient.update({
            index: 'cafes',
            id: cafe.id.toString(),
            body: {
              doc: {
                name: cafe.name,
                menu_items: cafe.menu_items,
                address: cafe.address,
              },
            },
          });
          console.log(`카페 ${cafe.id} 업데이트 완료`);
        } else {
          // 문서가 없으면 새로 삽입
          await elasticsearchClient.index({
            index: 'cafes',
            id: cafe.id.toString(),
            body: {
              name: cafe.name,
              menu_items: cafe.menu_items,
              address: cafe.address,
            },
          });
          console.log(`카페 ${cafe.id} 삽입 완료`);
        }
      } catch (err) {
        console.error(`카페 ${cafe.id} 처리 중 오류 발생:`, err);
      }
    }

    console.log('엘라스틱서치 동기화 성공');
  } catch (error) {
    console.error('엘라스틱서치 동기화 중 에러:', error);
  }
}