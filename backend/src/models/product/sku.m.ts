import mongoose, { Schema } from "mongoose";
import { ISkuM } from "../../types/product.type";

export interface SkuMDocment extends ISkuM, mongoose.Document {
    _id?: any;
}

// export interface ISkuM {
//     _id?: any
//     spu: ISkuM
//     tierIndex?: number[]
//     default: boolean
//     sort?: number
//     price: number
//     stock: number
//     product?: ISpu
//     isDraft?: boolean
//     isPublished?: boolean
//     isDeleted?: boolean
// }

const SkuMSchema = new Schema<SkuMDocment>({
    spu: { type: mongoose.Schema.Types.ObjectId, ref: 'SpuM' },
    tierIndex: [{ type: Number }],
    default: { type: Boolean, required: true },
    sort: { type: Number },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    isDraft: { type: Boolean },
    isPublished: { type: Boolean },
    isDeleted: { type: Boolean }
}, { timestamps: true })

export const SkuMModel = mongoose.model<SkuMDocment>('SkuM', SkuMSchema)
