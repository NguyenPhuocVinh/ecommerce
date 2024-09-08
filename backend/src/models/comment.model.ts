import mongoose, { Document, Schema } from "mongoose";
import { IComment } from "../types/comment.type";

export interface CommentDocument extends IComment, Document { }


// export interface IComment {
//     product: IProduct
//     user: string
//     content: string
//     left: number
//     right: number
//     parent_id?: any
//     isDeleted?: boolean
// }

const CommentSchema = new Schema<CommentDocument>({
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    left: { type: Number, default: null },
    right: { type: Number, default: null },
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    isDeleted: { type: Boolean, default: false, select: false }

}, { timestamps: true });

export const CommentModel = mongoose.model<CommentDocument>('Comment', CommentSchema);