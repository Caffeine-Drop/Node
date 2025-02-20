import { createReview } from "../repositories/review_registration_repository.js";
import { ReviewRegistrationDTO } from "../dtos/review_registration_dto.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { InternalServerError } from "../error/error.js";
import s3 from "../config/s3client.js";

// S3 이미지 업로드 함수
export const uploadImagesToS3 = async (files) => {
    if (!files || files.length === 0) return [];

    try {
        const uploadPromises = files.map(async (file) => {
            const fileExtension = file.originalname.split('.').pop(); // 확장자 추출
            const key = `review/${uuidv4()}.${fileExtension}`; // 짧은 UUID 기반 키 사용
            const params = {
                Bucket: "caffeinedrop",
                Key: key,
                Body: file.buffer
            };
            await s3.send(new PutObjectCommand(params));
            return `https://caffeinedrop.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        });

        return await Promise.all(uploadPromises);
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
            images: reviewData.images,
        });

        reviewDTO.validate();

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