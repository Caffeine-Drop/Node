import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class CafeRepository {
  static async findCafesByOperatingHours(dayOfWeek, time) {
    // time을 Date 객체로 변환 후 9시간 추가 (UTC → KST) js기본이 utc기준이어서 변환 필수
    const kstTime = new Date(time);
    kstTime.setHours(kstTime.getHours() + 9);

    console.log('kst', kstTime.toISOString());

    return await prisma.cafe.findMany({
      where: {
        operating_hours: {
          some: {
            day_of_week: dayOfWeek.trim(),
            open_time: { lte: kstTime },
            close_time: { gte: kstTime },
          },
        },
      },
      //해당 카페 운영시간 테이블 전체
      // include: {
      //   operating_hours: true,
      // },
      //카페id,카페이름,운영시간만 출력
      select: {
        cafe_id: true,
        name: true,
        operating_hour: true,
      },
    });
  }
}
