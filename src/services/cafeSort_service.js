import { sortRepository } from '../repositories/cafeSort_repository.js';
import { cafeSortDto } from '../dtos/cafeSort_dto.js';

export class sortCafe {
  static async sortByEvalu(evaluation) {
    const cafeSort = await sortRepository.sortCafeByEvalu(evaluation);

    if (!Array.isArray(cafeSort)) {
      throw new Error('Evaluation result is not an array');
    }

    // CafeDto로 응답 데이터를 포맷 (배열 변환)
    return cafeSortDto.fromArray(cafeSort);
  }
}
