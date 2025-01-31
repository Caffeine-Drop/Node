export class CafeDto {
  cafe_id;
  name;
  latitude;
  longitude;
  address;
  phone_number;
  operating_hour;
  created_at;
  updated_at;
  owner_id;
  images;
  menu_items;
  reviews;
  likes;
  beans;
  filters;
  operating_hours;

  constructor(cafe) {
    this.cafe_id = cafe.cafe_id;
    this.name = cafe.name;
    this.latitude = cafe.latitude;
    this.longitude = cafe.longitude;
    this.address = cafe.address;
    this.phone_number = cafe.phone_number;
    this.operating_hour = cafe.operating_hour;
    this.created_at = cafe.created_at;
    this.updated_at = cafe.updated_at;
    this.owner_id = cafe.owner_id;
    this.images = cafe.images;
    this.menu_items = cafe.menu_items;
    this.reviews = cafe.reviews;
    this.likes = cafe.likes;
    this.beans = cafe.beans;
    this.filters = cafe.filters;
    this.operating_hours = cafe.operating_hours;
  }
}
