import { ValidationError } from "../error/error.js";

export class ReviewRegistrationDTO {
  constructor({ cafeId, userId, content, evaluations, images }) {
    this.cafeId = cafeId;
    this.userId = userId;
    this.content = content;
    
    // evaluations가 문자열(JSON)일 경우 파싱
    try {
      this.evaluations =
        typeof evaluations === "string"
          ? JSON.parse(evaluations)
          : evaluations;
    } catch (error) {
      throw new ValidationError("evaluations 형식이 올바르지 않습니다. (JSON 형식이어야 합니다.)");
    }

    // 📌 images가 없는 경우 빈 배열 처리
    this.images = images || [];
  }

  validate() {
    if (!this.cafeId || isNaN(this.cafeId)) {
      throw new ValidationError("cafeId는 숫자여야 합니다.");
    }
    if (!this.userId || isNaN(this.userId)) {
      throw new ValidationError("userId는 숫자여야 합니다.");
    }
    if (!this.content || typeof this.content !== "string") {
      throw new ValidationError("content는 문자열이어야 합니다.");
    }

    // 📌 evaluations 배열 유효성 검사
    if (!Array.isArray(this.evaluations) || this.evaluations.length !== 4) {
      throw new ValidationError("평점 항목 4개를 모두 입력해야 합니다.");
    }
    this.evaluations.forEach((evaluation, index) => {
      if (!evaluation.criteriaId || isNaN(Number(evaluation.criteriaId))) {
        throw new ValidationError(`evaluations[${index}].criteriaId는 숫자여야 합니다.`);
      }
      if (
        !evaluation.rating ||
        isNaN(Number(evaluation.rating)) ||
        evaluation.rating < 1 ||
        evaluation.rating > 5
      ) {
        throw new ValidationError(`evaluations[${index}].rating은 1~5 사이의 숫자여야 합니다.`);
      }
    });

    // 📌 images 유효성 검사 (배열인지 확인)
    if (!Array.isArray(this.images)) {
      throw new ValidationError("images는 배열이어야 합니다.");
    }
    if (this.images.length > 6) {
      throw new ValidationError("이미지는 최대 6장까지만 업로드할 수 있습니다.");
    }
    this.images.forEach((image, index) => {
      if (typeof image !== "string") {
        throw new ValidationError(`images[${index}]는 문자열 URL이어야 합니다.`);
      }
    });
  }
}

// 📌 리뷰 응답 DTO
export class ReviewResponseDTO {
  constructor(review) {
    this.reviewId = review.review_id;
    this.cafeId = review.cafe_id;
    this.userId = review.user_id;
    this.content = review.content;
    this.evaluations = review.evaluations.map((evaluation) => ({
      criteriaId: evaluation.evaluation_criteria_id,
      rating: evaluation.rating,
    }));
    this.images = review.images.map((image) => ({
      imageId: image.review_image_id,
      imageUrl: image.image_url,
    }));
  }
}
