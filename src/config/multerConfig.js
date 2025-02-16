import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { s3 } from './s3client.js'; // S3 클라이언트 불러오기

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: "caffeinedrop",
        acl: 'public-read-write',
        key: function (req, file, cb) {
            const dir = req.dir;
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, `${dir}/${uniqueSuffix}_${path.extname(file.originalname)}`); // S3에 저장될 파일 경로와 이름
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
    }),
});

export { upload };
