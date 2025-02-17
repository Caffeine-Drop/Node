// import { sortRepository } from '../repositories/cafeSort_repository.js';
// import { cafeSortDto } from '../dtos/cafeSort_dto.js';

// export class sortCafe {
//   static async sortByEvalu(evaluation) {
//     const cafeSort = await sortRepository.sortCafeByEvalu(evaluation);

//     if (!Array.isArray(cafeSort)) {
//       throw new Error('Evaluation result is not an array');
//     }

//     // CafeDto로 응답 데이터를 포맷 (배열 변환)
//     return cafeSortDto.fromArray(cafeSort);
//   }
// }

import { sortRepository } from '../repositories/cafeSort_repository.js';
import { cafeSortDto } from '../dtos/cafeSort_dto.js';

export class sortCafe {
  static async sortByEvalu(evaluation, lat = null, lng = null) {
    const cafeSort = await sortRepository.sortCafeByEvalu(evaluation, lat, lng);

    if (!Array.isArray(cafeSort)) {
      throw new Error('Evaluation result is not an array');
    }

    // CafeDto로 응답 데이터를 포맷 (배열 변환)
    return cafeSortDto.fromArray(cafeSort);
  }

  // 새로운 메서드 추가
  static async sortByDistance(lat, lng) {
    const cafeSort = await sortRepository.sortCafeByDistance(lat, lng);

    if (!Array.isArray(cafeSort)) {
      throw new Error('Distance sorting result is not an array');
    }

    return cafeSortDto.fromArray(cafeSort); // DTO로 변환해서 반환
  }
}
