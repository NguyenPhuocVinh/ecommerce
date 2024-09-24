import mongoose, { Schema } from "mongoose";
import { ISpu } from "../../types/product.type";
import slugify from "slugify";

export interface SpuDocment extends ISpu, mongoose.Document {
    _id?: any;
}

const SpuSchema = new Schema<SpuDocment>({
    productName: { type: String, required: true },
    slug: { type: String },
    thumb: [{ type: String, default: [] }],
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    feature: { type: Boolean, default: false },
    // quantity: { type: Number, required: true },
    // attributeIds: [{
    //     attributeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attribute' },
    //     valueId: [{ type: Number, required: true }]
    // }],
    ratingsAverage: { type: Number },
    // variations: [{
    //     name: { type: String, required: true },
    //     values: [{ type: String, required: true }]
    // }],
    isDraft: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: false, index: true }
}, { timestamps: true })

SpuSchema.index({ name: 'text', description: 'text' })

//Document middleware: runs before .save() and .create()
SpuSchema.pre("save", function (next) {
    this.slug = slugify(this.productName, { lower: true });
    next();
})

export const SpuModel = mongoose.model<SpuDocment>('Spu', SpuSchema)