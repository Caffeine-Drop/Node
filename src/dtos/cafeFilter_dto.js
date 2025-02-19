export class CafeFilterDto {
  constructor(dayOfWeek, time, likes, rating, criteria) {
    this.dayOfWeek = dayOfWeek;
    this.time = time;
    this.likes = likes;
    this.rating = rating;
    this.criteria = criteria;
  }
}
