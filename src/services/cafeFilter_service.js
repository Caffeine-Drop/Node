import { CafeRepository } from '../repositories/cafeFilter_repository.js';

export class CafeService {
  async getCafesByFilters(filterDto) {
    // console.log('filterDto in service:', filterDto);
    return await CafeRepository.findCafesByFilters(filterDto);
  }
}
