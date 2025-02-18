import multer from "multer";

// Multer 설정 (메모리 저장소 사용)
const upload = multer({ storage: multer.memoryStorage() });

// 리뷰 이미지 업로드 미들웨어 (최대 6장)
export const uploadReviewImages = upload.array("images", 6);