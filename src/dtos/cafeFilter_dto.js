export class CafeFilterDto {
  constructor(dayOfWeek, time, likes, rating) {
    this.dayOfWeek = dayOfWeek;
    this.time = time;
    this.likes = likes;
    this.rating = rating;
  }
}
