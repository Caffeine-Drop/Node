import { CafeRepository } from '../repositories/cafeFilter_repository.js';

export class CafeService {
  async getCafesByOperatingHours(filterDto) {
    const { dayOfWeek, time } = filterDto;
    return await CafeRepository.findCafesByOperatingHours(dayOfWeek, time);
  }
}
