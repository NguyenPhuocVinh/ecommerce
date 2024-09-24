import mongoose, { Schema } from "mongoose";
import { ISku } from "../../types/product.type";

export interface SkuDocment extends ISku, mongoose.Document {
    _id?: any;
}
const SkuSchema = new Schema<SkuDocment>({
    spuId: { type: String, required: true },
    default: { type: Boolean, required: true },
    thumb: [{ type: String, default: [] }],
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    isDraft: { type: Boolean },
    isPublished: { type: Boolean },
    isDeleted: { type: Boolean }
}, { timestamps: true })


export const SkuModel = mongoose.model<SkuDocment>('Sku', SkuSchema)
