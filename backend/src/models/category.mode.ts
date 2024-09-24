import mongoose, { Document } from "mongoose";
import { ICategory } from "../types/product.type";
import slugify from "slugify";

export interface CategoryDocument extends ICategory, Document { };

// export interface ICategory {
//     name: string
//     slug?: string
//     description?: string
//     parentCategory?: ICategory[]
// }
const CategorySchema = new mongoose.Schema<CategoryDocument>({
    name: { type: String, required: true },
    slug: { type: String },
    thumb: { type: String },
    description: { type: String, required: true },
    parentCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null }]
}, { timestamps: true })

CategorySchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
})

export const CategoryModel = mongoose.model<CategoryDocument>('Category', CategorySchema)
