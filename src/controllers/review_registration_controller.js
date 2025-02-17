import { uploadReviewImages } from "../middlewares/multerMiddleware.js";
import { registerReview } from "../services/review_registration_service.js";
import {
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
} from "../error/error.js";

// multer 미들웨어를 프로미스화
const uploadReviewImagesAsync = promisify(uploadReviewImages);

export const createReviewController = async (req, res) => {
    try {
        // Multer 미들웨어 실행 (파일 업로드)
        await uploadReviewImagesAsync(req, res);

        const { cafeId } = req.params;
        const userId = req.body.userId;
        const content = req.body.content || null;
        const evaluations = req.body.evaluations ? JSON.parse(req.body.evaluations) : [];

        // 업로드된 이미지가 있으면 S3 URL만 저장
        const uploadedImages = req.files ? req.files.map(file => file.location) : [];
        
        const reviewData = {
            cafeId,
            userId,
            content, // null일 수도 있음
            evaluations,
            images: uploadedImages, // S3 URL 리스트
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