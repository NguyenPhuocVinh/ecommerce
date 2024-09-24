import { AppConfig } from "./app.config"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: AppConfig.cloudinary.cloud_name,
    api_key: AppConfig.cloudinary.api_key,
    api_secret: AppConfig.cloudinary.api_secret,
    secure: true
})

export default cloudinary