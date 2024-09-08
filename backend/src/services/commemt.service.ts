import { Types } from 'mongoose'
import { CommentModel } from '../models/comment.model'
import { ProductRepo } from '../repo/product.repo'

export class CommentService {
    static async createComment({
        productId,
        userId,
        content,
        parentId = null
    }: {
        productId: string
        userId: string
        content: string
        parentId?: string | null
    }) {
        const comment = await CommentModel.create({
            productId,
            userId,
            content,
            parentId
        })

        let rightValue = 0
        if (parentId) {
            // reply comment
            const parentComment = await CommentModel.findById(parentId, 'right')
            if (!parentComment) throw new Error('Comment not found')

            rightValue = parentComment.right

            await CommentModel.updateMany(
                {
                    productId,
                    right: { $gte: rightValue }
                },
                {
                    $inc: { right: 2 }
                }
            )

            await CommentModel.updateMany(
                {
                    productId,
                    left: { $gt: rightValue }
                },
                {
                    $inc: { left: 2 }
                }
            )
        } else {
            const maxRightValue = await CommentModel.findOne({ productId }, 'right', {
                sort: { right: -1 }
            })
            rightValue = maxRightValue ? maxRightValue.right + 1 : 1
        }

        comment.left = rightValue
        comment.right = rightValue + 1

        return comment.save()
    }

    static async getCommentsByParentId({
        productId,
        parentId,
        limit = 50,
        offset = 0
    }: {
        productId: string
        parentId: string | null
        limit?: number
        offset?: number
    }) {
        if (!Types.ObjectId.isValid(productId)) {
            throw new Error('Invalid product_id')
        }

        const commonQuery = { productId }
        const commonProjection = {
            left: 1,
            right: 1,
            content: 1,
            parentId: 1
        }

        if (parentId) {
            if (!Types.ObjectId.isValid(parentId)) {
                throw new Error('Invalid parent_id')
            }

            const parent = await CommentModel.findById(parentId)
            if (!parent) throw new Error('Comment not found')

            return CommentModel.find({
                ...commonQuery,
                left: { $gt: parent.left },
                right: { $lt: parent.right }
            })
                .select(commonProjection)
                .sort({ left: 1 })
                .limit(limit)
                .skip(offset)
        }

        return CommentModel.find({ ...commonQuery, parentId: null })
            .select(commonProjection)
            .sort({ left: 1 })
            .limit(limit)
            .skip(offset)
    }

    static async deleteComments({ commentId, productId }: { commentId: string; productId: string }) {
        const foundProduct = await ProductRepo.findProduct({
            productId
        })
        if (!foundProduct) throw new Error('Product not found')

        const comment = await CommentModel.findById(commentId)
        if (!comment) throw new Error('Comment not found')

        // Get left and right value of the comment
        const leftValue = comment.left
        const rightValue = comment.right

        // Get width of the comment
        const width = rightValue - leftValue + 1

        // Delete the comment
        await CommentModel.deleteMany({
            productId,
            left: { $gte: leftValue, $lte: rightValue }
        })

        // Update left and right value of the comments that are to the right of the deleted comment
        await CommentModel.updateMany(
            {
                productId,
                left: { $gt: rightValue }
            },
            {
                $inc: { left: -width }
            }
        )

        await CommentModel.updateMany(
            {
                productId,
                right: { $gt: rightValue }
            },
            {
                $inc: { right: -width }
            }
        )
    }
}
