export class ReviewRegistrationDTO {
  constructor({ cafeId, userId, content, evaluations, images }) {
    this.cafeId = cafeId;
    this.userId = userId;
    this.content = content;
    this.evaluations = evaluations;
    this.images = images || [];
  }

  validate() {
    if (!this.cafeId || typeof this.cafeId !== "number") {
      throw new Error("cafeId는 숫자여야 합니다.");
    }
    if (!this.userId || typeof this.userId !== "number") {
      throw new Error("userId는 숫자여야 합니다.");
    }
    if (!this.content || typeof this.content !== "string") {
      throw new Error("content는 문자열이어야 합니다.");
    }
    if (!Array.isArray(this.evaluations) || this.evaluations.length !== 4) {
      throw new Error("평점 항목 4개를 모두 입력해야 합니다.");
    }
    this.evaluations.forEach((evaluation) => {
      if (!evaluation.criteriaId || typeof evaluation.criteriaId !== "number") {
        throw new Error("criteriaId는 숫자여야 합니다.");
      }
      if (
        !evaluation.rating ||
        typeof evaluation.rating !== "number" ||
        evaluation.rating < 1 ||
        evaluation.rating > 5
      ) {
        throw new Error("rating은 1~5 사이의 숫자여야 합니다.");
      }
    });
    if (this.images && this.images.length > 6) {
      throw new Error("이미지는 최대 6장까지만 업로드할 수 있습니다.");
    }
  }
}

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
