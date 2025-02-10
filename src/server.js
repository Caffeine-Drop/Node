import app from "./app.js";
import syncCafesToElasticsearch from './middlewares/elasticsearch.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

(async () => {
  console.log("Elasticsearch 동기화 시작...");
  try {
    await syncCafesToElasticsearch();
    console.log("Elasticsearch 동기화 완료");
  } catch (error) {
    console.error("Elasticsearch 동기화 실패:", error);
  }
})();
