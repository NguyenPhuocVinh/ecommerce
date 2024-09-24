import cloudinary from "../configs/cloudinary.config";

export class UploadService {
    static async uploadImage(files: any[]) {
        const promises = files.map((file) =>
            cloudinary.uploader.upload(file.path, { folder: "sku" })
        );
        const uploadResults = await Promise.all(promises);
        return uploadResults;
    }

}