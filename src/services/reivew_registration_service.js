import { createReview } from "../repositories/review_registration_repository.js";
import { ReviewRegistrationDTO } from "../dtos/review_registration_dto.js";
import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { ValidationError, InternalServerError } from "../error/error.js";

// AWS S3 설정
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});
const s3 = new AWS.S3();
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

// S3 이미지 업로드 함수
const uploadImagesToS3 = async (files) => {
    if (!files || files.length === 0) return [];

    try {
        const uploadPromises = files.map((file) => {
            const params = {
                Bucket: BUCKET_NAME,
                Key: `review/${uuidv4()}-${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            return s3.upload(params).promise();
        });

        const uploadResults = await Promise.all(uploadPromises);
        return uploadResults.map((result) => result.Location);
    } catch (error) {
        console.error("S3 이미지 업로드 실패:", error);
        throw new InternalServerError("이미지 업로드 중 오류가 발생했습니다.");
    }
};

// 리뷰 등록 서비스
export const registerReview = async (reviewData) => {
    try {
        // DTO 생성 및 검증
        const reviewDTO = new ReviewRegistrationDTO({
            cafeId: reviewData.cafeId,
            userId: reviewData.userId,
            content: reviewData.content || null,
            evaluations: typeof reviewData.evaluations === "string"
                ? JSON.parse(reviewData.evaluations)
                : reviewData.evaluations,
        });

        reviewDTO.validate();

        // S3 이미지 업로드
        const uploadedImages = await uploadImagesToS3(reviewData.images || []);
        reviewDTO.images = uploadedImages;

        // 리뷰 저장
        return await createReview({
            cafeId: reviewDTO.cafeId,
            userId: reviewDTO.userId,
            content: reviewDTO.content,
            evaluations: reviewDTO.evaluations,
            images: reviewDTO.images,
        });
    } catch (error) {
        console.error("Error in registerReview:", error);
        throw new InternalServerError("리뷰 등록 중 오류가 발생했습니다.");
    }
};
