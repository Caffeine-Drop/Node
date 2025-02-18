import { uploadReviewImages } from "../middlewares/multerMiddleware.js";
import { registerReview } from "../services/review_registration_service.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // S3 클라이언트 추가
import dotenv from "dotenv";
import {
    ValidationError,
    InternalServerError,
} from "../error/error.js";

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// S3에 이미지 업로드 함수
const uploadToS3 = async (file) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read",
    };


    await s3.send(new PutObjectCommand(uploadParams));

    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

export const createReviewController = async (req, res) => {
    uploadReviewImages(req, res, async (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(400).json({
                result: "Fail",
                data: null,
                error: {
                    code: "MulterError",
                    message: "이미지 업로드 중 오류가 발생했습니다.",
                    status: 400,
                },
            });
        }

        try {
            const { cafeId } = req.params;
            const userId = req.body.userId;
            const content = req.body.content || null;
            const evaluations = req.body.evaluations ? JSON.parse(req.body.evaluations) : [];


            // S3에 이미지 업로드 후 URL 저장
            const uploadedImages = [];
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const imageUrl = await uploadToS3(file); // S3 업로드 실행
                    uploadedImages.push(imageUrl);
                }
            }
        
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

        return res.status(err.status || 500).json({
            result: "Fail",
            data: null,
            error: {
                code: err.name || "InternalServerError",
                message: err.message || "서버 에러가 발생했습니다.",
                status: err.status || 500,
            },
        });
    }
});
};