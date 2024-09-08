import mongoose, { Document, model, Schema } from "mongoose";
import { ISpu } from "../../types/product.type";
import slugify from "slugify";

export interface SpuDocument extends ISpu, Document {
    _id: Schema.Types.ObjectId
};

// export interface ISpu {
//     _id?: any
//     productName: string
//     slug?: string
//     thumb?: string
//     description?: string
//     price: number
//     category: any
//     quantity: number
//     shop: IShop
//     attributes?: any
//     ratingsAverage?: number
//     variations?: any[]
//     isDraft?: boolean
//     isPublished?: boolean
//     isDeleted?: boolean
// }
const SpuSchema = new Schema<SpuDocument>({
    productName: { type: String, required: true },
    slug: { type: String },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: {
        type: Number, required: true, validate: {
            validator: function (value) {
                return value >= 0;
            },
            message: 'Quantity cannot be negative'
        }
    },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    attributes: { type: mongoose.Schema.Types.Mixed, required: true },
    ratingsAverage: { type: Number, default: 0, min: 0, max: 5, set: (val: number) => Math.round(val * 10) / 10 },
    variations: [{ type: Object }],
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }
})

SpuSchema.index({ name: 'text', description: 'text' })

//Document middleware: runs before .save() and .create()
SpuSchema.pre("save", function (next) {
    this.slug = slugify(this.productName, { lower: true });
    next();
})

export const SpuModel = model<SpuDocument>('Spu', SpuSchema)