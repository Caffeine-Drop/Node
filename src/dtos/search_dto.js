// 카페 정보 반환 DTO
class CafeResponseDTO {
  constructor(
    name, latitude, longitude, address, operatingHours,
    images, likes, reviewRate, reviewCount, specialty
  ) {
    this.name = name;
    this.latitude = latitude;
    this.longitude = longitude;
    this.address = address;
    this.operatingHours = operatingHours;
    this.images = images;
    this.likes = likes;
    this.reviewRate = reviewRate
    this.reviewCount = reviewCount
    this.specialty = specialty;
  }
}