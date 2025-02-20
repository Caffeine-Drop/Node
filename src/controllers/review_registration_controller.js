import { registerReview, uploadImagesToS3 } from "../services/reivew_registration_service.js";
import util from "util";
import {
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
} from "../error/error.js";

export const createReviewController = async (req, res) => {
    try {
        const cafeId = Number(req.params.cafeId);
		const userId = String(req.user_id);
        const content = req.body.content || null;
        const evaluations = req.body.evaluations || [];
        console.log("카페 리뷰 반환", cafeId);

        // S3 업로드
        const uploadedImages = await uploadImagesToS3(req.files);
        
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