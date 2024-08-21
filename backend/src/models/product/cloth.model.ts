import mongoose from "mongoose";
import { IClothes } from "../../types/product.type";

export interface ClothDocument extends IClothes, mongoose.Document { }

const ClothSchema = new mongoose.Schema<ClothDocument>({
    brand: { type: String, required: true },
    size: { type: String, required: true },
    meterial: { type: String, required: true },
}, { timestamps: true });

export const ClothModel = mongoose.model<ClothDocument>("Cloth", ClothSchema);