import mongoose, { Document, model, ObjectId, Schema, Types } from "mongoose"
import slugify from "slugify"

export interface ICategory {
    _id: any
    categoryName: string
    slug: string
    parentCategory: any[]
}

export interface CategoryDocument extends ICategory, Document {
    _id: ObjectId
};

const CategorySchema = new Schema<CategoryDocument>({
    categoryName: { type: String, required: true },
    slug: { type: String },
    parentCategory: [{ type: Types.ObjectId, ref: 'Category', default: null }]
}, { timestamps: true })

CategorySchema.pre('save', function (next) {
    this.slug = slugify(this.categoryName, { lower: true });
    next()
})

export const CategoryModel = model<CategoryDocument>('Category', CategorySchema)


