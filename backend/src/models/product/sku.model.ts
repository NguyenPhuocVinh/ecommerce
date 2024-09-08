import mongoose, { Document, model, Schema, Types } from "mongoose";
import { ISku } from "../../types/product.type";

export interface SkuDocument extends ISku, Document {
    _id: Types.ObjectId
};

// export interface ISku {
//     _id?: any
//     tierIndex?: number[]
//     default: boolean
//     sort?: number
//     price: number
//     stock: number
//     product: ISpu
//     isDraft?: boolean
//     isPublished?: boolean
//     isDeleted?: boolean
// }

const SkuSchema = new Schema<SkuDocument>({
    tierIndex: { type: [Number], required: true },
    default: { type: Boolean, default: false },
    sort: { type: Number },
    price: { type: Number, required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Sku', required: true },
    stock: { type: Number, required: true },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true })

export const SkuModel = model<SkuDocument>('Sku', SkuSchema)