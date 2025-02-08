import { uploadReviewImages } from "../middlewares/multerMiddleware.js";
import { registerReview } from "../services/review_registration_service.js";
import {
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
} from "../error/error.js";

export const createReviewController = async (req, res) => {
    try {
        // Multer 미들웨어 실행
        await new Promise((resolve, reject) => {
            uploadReviewImages(req, res, (err) => {
                if (err) {
                    console.error("Multer error:", err);
                    return reject(new ValidationError("파일 업로드 중 오류가 발생했습니다."));
                }
                resolve();
            });
        });

        const { cafeId } = req.params;
        const userId = req.body.userId;
        const content = req.body.content || null;

        const reviewData = {
            cafeId,
            userId,
            content, // null일 수도 있음
            evaluations,
            images: req.files || [],
        };

        const review = await registerReview(reviewData);

        return res.status(201).json({
            result: "Success",
            data: review,
            error: null,
        });
    } catch (err) {
        console.error("Error in createReviewController:", err);

        const status = err.status || 500;
        const code = err.name || "InternalServerError";
        const message = err.message || "서버 에러가 발생했습니다.";

        return res.status(status).json({
            result: "Fail",
            data: null,
            error: { code, message, status },
        });
    }
};