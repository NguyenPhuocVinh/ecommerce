import multer from "multer";
import fs from "fs";

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = './src/uploads';
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});


export const upload = multer({ storage: storage });

const VARIANT_COUNT = 10;
const createUploadWithVariants = (variantCount: number) => {
    const fields = [
        { name: 'product[imageProduct]', maxCount: 10 }
    ];

    const variantFields = Array.from({ length: variantCount }, (_, i) => ({
        name: `variant_list[${i}]imageVariant`,
        maxCount: 10,
    }));

    return upload.fields([...fields, ...variantFields]);
};

export const multipleUpload = createUploadWithVariants(VARIANT_COUNT)

