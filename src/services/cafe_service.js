import { CafeRepository } from '../repositories/cafe_repository.js';
import { CafeDto } from '../dtos/cafe_dto.js';
import { NotFoundError } from '../error/error.js';

export class readCafeInfos {
  static async getCafeById(cafeId) {
    // console.log(cafeId);
    // 카페 데이터를 조회
    const cafe = await CafeRepository.findCafeById(cafeId);
    if (!cafe) {
      throw new Error('Cafe not found');
    }

    // CafeDto로 응답 데이터를 포맷
    return new CafeDto(cafe);
  }

  static async getCafe() {
    const cafes = await CafeRepository.findCafe();
    return cafes.map(cafe => cafe.id);
  }
}