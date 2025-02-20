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

export async function syncCafesToElasticsearch() {
  try {
    await checkElasticsearchConnection();

    // 인덱스 존재 여부 확인
    const indexExists = await elasticsearchClient.indices.exists({ index: 'cafes' });

    if (!indexExists.body) {
      // 인덱스가 존재하지 않으면 새로 생성
      try {
        await elasticsearchClient.indices.create({
          index: 'cafes',
          body: {
            settings: {
              analysis: {
                tokenizer: {
                  edge_ngram_tokenizer: {
                    type: 'edge_ngram',
                    min_gram: 1,
                    max_gram: 25,
                    token_chars: ['letter', 'digit'],
                  },
                },
                analyzer: {
                  edge_ngram_analyzer: {
                    type: 'custom',
                    tokenizer: 'edge_ngram_tokenizer',
                  },
                },
              },
            },
            mappings: {
              properties: {
                name: {
                  type: 'text',
                  analyzer: 'edge_ngram_analyzer',
                },
                menu_items: { type: 'text' },
                address: { type: 'text' },
                location: { type: 'geo_point' },
              },
            },
          },
        });
        console.log('Elasticsearch 인덱스 "cafes"가 생성되었습니다.');
      } catch (err) {
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
      if (!cafe.cafe_id) {
        console.error(`카페 데이터에서 cafe_id가 없습니다:`, cafe);
        continue;
      }

      try {
        // 문서가 이미 존재하면 update, 없으면 insert
        const existingDoc = await elasticsearchClient.exists({
          index: 'cafes',
          id: cafe.cafe_id.toString(),
        });

        const location = {
          lat: cafe.latitude,
          lon: cafe.longitude,
        };

        if (existingDoc.body) {
          // 문서가 이미 존재하면 update
          await elasticsearchClient.update({
            index: 'cafes',
            id: cafe.cafe_id.toString(),
            body: {
              doc: {
                name: cafe.name,
                menu_items: cafe.menu_items,
                address: cafe.address,
                location: location,  // location 필드 업데이트
              },
            },
          });
          console.log(`카페 ${cafe.cafe_id} 업데이트 완료`);
        } else {
          // 문서가 없으면 새로 삽입
          await elasticsearchClient.index({
            index: 'cafes',
            id: cafe.cafe_id.toString(),
            body: {
              name: cafe.name,
              menu_items: cafe.menu_items,
              address: cafe.address,
              location: location,  // location 필드 삽입
            },
          });
          console.log(`카페 ${cafe.cafe_id} 삽입 완료`);
        }
      } catch (err) {
        console.error(`카페 ${cafe.cafe_id} 처리 중 오류 발생:`, err);
      }
    }

    console.log('엘라스틱서치 동기화 성공');
  } catch (error) {
    console.error('엘라스틱서치 동기화 중 에러:', error);
  }
}

// 검색 예시: fuzziness와 edge_ngram을 결합한 검색
export async function searchCafesByKeyword(keyword, lat, lng, radius) {
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
                fuzziness: 'AUTO',  // fuzzy 검색
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

  return result.body.hits.hits;
}