import mongoose, { Document, model, Schema, Types } from "mongoose";
import slugify from "slugify";

export interface IProduct {
    _id: any
    productName: string
    description: string
    categoryId: any
    attributeIds: any[]
    image: string[]
    slug: string
    price: number
    isPublish: boolean
}

export interface ProductDocument extends IProduct, Document {
    _id: Types.ObjectId
}

const ProductSchema = new Schema<ProductDocument>({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: { type: Types.ObjectId, ref: 'Category' },
    image: [{ type: String, default: '' }],
    slug: { type: String },
    isPublish: { type: Boolean, default: false }
}, { timestamps: true })

ProductSchema.pre('save', function (next) {
    this.slug = slugify(this.productName, { lower: true })
    next()
})

export const ProductModel = model<ProductDocument>('ProductV2', ProductSchema)