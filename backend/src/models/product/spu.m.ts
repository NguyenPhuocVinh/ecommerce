import mongoose, { Schema } from "mongoose";
import { ISpuM } from "../../types/product.type";
import slugify from "slugify";

export interface SpuMDocment extends ISpuM, mongoose.Document {
    _id?: any;
}

// export interface ISpuM {
//     _id?: any
//     productName: string
//     slug?: string
//     thumb?: string
//     description?: string
//     price: number
//     category: any
//     quantity: number
// shop?: any
//     attributeIds?: {
//         attributeId?: any
//         valueId?: any
//     }
//     ratingsAverage?: number
//     variations?: IVaritation[]
//     isDraft?: boolean
//     isPublished?: boolean
//     isDeleted?: boolean
// }

const SpuMSchema = new Schema<SpuMDocment>({
    productName: { type: String, required: true },
    slug: { type: String },
    thumb: { type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    quantity: { type: Number, required: true },
    // attributeIds: [{
    //     attributeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attribute' },
    //     valueId: [{ type: Number, required: true }]
    // }],
    ratingsAverage: { type: Number },
    variations: [{
        name: { type: String, required: true },
        values: [{ type: String, required: true }]
    }],
    isDraft: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: false, index: true }
}, { timestamps: true })

SpuMSchema.index({ name: 'text', description: 'text' })

//Document middleware: runs before .save() and .create()
SpuMSchema.pre("save", function (next) {
    this.slug = slugify(this.productName, { lower: true });
    next();
})

export const SpuMModel = mongoose.model<SpuMDocment>('SpuM', SpuMSchema)