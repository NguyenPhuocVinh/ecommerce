import mongoose from "mongoose";
import slugify from "slugify";
import { IProduct } from "../../types/product.type";
import { PRODUCT_TYPE } from "../../libs/contants/productType";

export interface ProductDocument extends IProduct, mongoose.Document {
    _id: mongoose.Types.ObjectId;
}

const ProductSchema = new mongoose.Schema<ProductDocument>({
    name: { type: String, required: true },
    thumb: { type: String, required: true },
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
    type: { type: String, required: true, enum: Object.values(PRODUCT_TYPE) },
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop" },
    attributes: { type: mongoose.Schema.Types.Mixed, required: true },
    ratingAverage: { type: Number, default: 0, min: 0, max: 5, set: (val: number) => Math.round(val * 10) / 10 },
    variation: [{ type: String, default: [] }],
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }

}, { timestamps: true });

//create index for search
ProductSchema.index({ name: 'text', description: 'text' })

//Document middleware: runs before .save() and .create()
ProductSchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

export const ProductModel = mongoose.model<ProductDocument>("Product", ProductSchema);