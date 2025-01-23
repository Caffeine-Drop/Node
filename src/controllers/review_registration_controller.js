import multer from "multer";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid"; // UUID 생성
import { registerReview } from "../services/review_registration_service.js";
import { ReviewRegistrationDTO } from "../dtos/review_registration_dto.js";
import {
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
} from "../error/error.js"; // 에러 클래스 import

// AWS 설정
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// multer 설정 (메모리 저장소 사용)
const upload = multer({
    storage: multer.memoryStorage(),
    // 파일 크기 제한을 제거함
});

// 리뷰 등록 컨트롤러
export const createReviewController = async (req, res) => {
    upload.array("images", 6)(req, res, async (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(400).json({
                result: "Fail",
                error: {
                    code: "MulterError",
                    message: err.message,
                },
            });
        }

        try {
            const { cafeId } = req.params;
            const dto = new ReviewRegistrationDTO({
                cafeId,
                userId: req.body.userId,
                content: req.body.content,
                evaluations: JSON.parse(req.body.evaluations), // 문자열 데이터를 JSON으로 파싱
            });

            dto.validate();

            // S3 이미지 업로드
            const uploadedImages = [];
            if (req.files && req.files.length > 0) {
                const uploadPromises = req.files.map((file) => {
                    const params = {
                        Bucket: BUCKET_NAME,
                        Key: `${uuidv4()}-${file.originalname}`, // UUID로 파일 이름 중복 방지
                        Body: file.buffer,
                        ContentType: file.mimetype,
                    };
                    return s3.upload(params).promise();
                });

                const uploadResults = await Promise.all(uploadPromises);
                uploadedImages.push(...uploadResults.map((result) => result.Location));
            }

            // DTO에 이미지 추가
            dto.images = uploadedImages;

            // 리뷰 등록 서비스 호출
            const review = await registerReview(dto);

            return res.status(201).json({ result: "Success", data: review, error: null });
        } catch (error) {
            console.error("Error in createReviewController:", error);

            let status = 500;
            let code = "InternalServerError";
            let message = "서버 에러가 발생했습니다.";

            if (error instanceof ValidationError) {
                status = 400;
                code = "ValidationError";
                message = error.message;
            } else if (error instanceof NotFoundError) {
                status = 404;
                code = "NotFoundError";
                message = error.message;
            } else if (error instanceof UnauthorizedError) {
                status = 401;
                code = "UnauthorizedError";
                message = error.message;
            } else if (error instanceof ForbiddenError) {
                status = 403;
                code = "ForbiddenError";
                message = error.message;
            }

            res.status(status).json({
                result: "Fail",
                error: { code, message, status },
            });
        }
    });
};
