import * as reviewService from "../services/review_query_service.js";

export const getReviews = async (req, res) => {
  try {
    // 파라미터 추출
    const { cafeId } = req.params;
    const { offset = 0, limit = 10 } = req.query;

    // 유효성 검사
    if (!cafeId) {
      return res.status(400).json({
        result: "Fail",
        error: {
          code: "ValidationError",
          message: "cafeId는 필수값입니다.",
        },
      });
    }

    // 서비스 호출
    const data = await reviewService.getReviews(cafeId, offset, limit);

    // 성공 응답
    res.status(200).json({
      result: "Success",
      data: {
        reviews: data.reviews,
        pagination: {
          totalReviews: data.totalCount,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
        },
        overallRating: data.overallRating,
      },
      error: null,
    });
  } catch (error) {
    console.error("Error in getReviews controller:", error);

    // 에러 응답
    res.status(error.status || 500).json({
      result: "Fail",
      error: {
        code: error.name || "InternalServerError",
        message: error.message || "서버 에러가 발생했습니다.",
      },
    });
  }
};

export const getRating = async (req, res) => {
  try {
    const cafe_id = Number(req.params.cafe_id);
    if (!cafe_id) {
      return res.status(400).json({ message: '카페 아이디는 필수입니다.' });
    }

    const data = await reviewService.getRatings(cafe_id);
    res.status(200).json({data});
  } catch (error) {
    console.error("Error in getReviews controller:", error);
  }
}