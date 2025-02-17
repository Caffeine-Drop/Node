import * as cafeRatingService from "../services/cafe_rating_service.js";

export const getCafeRating = async (req, res) => {
  try {
    const { cafeId } = req.params;

    if (!cafeId) {
      return res.status(400).json({
        result: "Fail",
        error: {
          code: "ValidationError",
          message: "cafeId는 필수값입니다.",
        },
      });
    }

    const data = await cafeRatingService.getCafeRating(cafeId);

    res.status(200).json({
      result: "Success",
      data,
      error: null,
    });
  } catch (error) {
    console.error("Error in getCafeRating controller:", error);
    res.status(error.status || 500).json({
      result: "Fail",
      error: {
        code: error.name || "InternalServerError",
        message: error.message || "서버 에러가 발생했습니다.",
      },
    });
  }
};
