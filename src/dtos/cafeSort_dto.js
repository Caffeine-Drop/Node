export class cafeSortDto {
  constructor(cafe) {
    // cafe 객체에서 각 필드 매핑(정렬시 카페id,이름,주소,전화번호,좋아요 수 출력)
    this.cafe_id = cafe.cafe_id;
    // this.latitude = cafe.latitude; 정렬확인용으로 latitude사용
    this.name = cafe.name;
    this.address = cafe.address;
    this.phone_number = cafe.phone_number;
    this.like_count = cafe._count ? cafe._count.likes : 0;
    console.log('dtotest', this);
  }

  static fromArray(cafes) {
    console.log('fromArray 호출됨, cafes 개수:', cafes.length);
    const result = cafes.map((cafe) => new cafeSortDto(cafe)); // 배열 처리
    console.log('result', result);
    return result;
  }
}
