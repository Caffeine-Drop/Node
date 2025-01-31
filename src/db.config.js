import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1', // mysql의 hostname
  user: process.env.DB_USER || 'root', // user 이름
  port: process.env.DB_PORT || 3306, // 포트 번호
  database: process.env.DB_NAME || 'cafedb', // 데이터베이스 이름
  password: process.env.DB_PASSWORD || 'password', // 비밀번호
  waitForConnections: true,
  connectionLimit: 10, // 몇 개의 커넥션을 가지게끔 할 것인지
  queueLimit: 0, // getConnection에서 오류가 발생하기 전에 Pool에 대기할 요청의 개수 한도
});
