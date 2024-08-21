import { query } from "express";
import { ProductModel, ClothModel } from "../models";
import { skip } from "node:test";
import { IShop } from "../types/auth.type";
import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import mongoose, { Model, SortOrder, Document, Types } from "mongoose";
import { getSelectData, unGetSelectData } from "../utils/filter.util";

export class ProductRepo {
    static async findAllDraftsForShop({ query, limit, skip }: { query: any, limit: number, skip: number }) {
        return await this.queryProduct({ query, limit, skip })
    }

    static async findAllPublishForShop({ query, limit, skip }: { query: any, limit: number, skip: number }) {
        return await this.queryProduct({ query, limit, skip })
    }

    static async searchProductByUser({ keySearch }: { keySearch: any }) {
        const regexSearch = new RegExp(keySearch);
        const results = await ProductModel.find({
            isPublished: true,
            $text: { $search: regexSearch.toString() }
        },
            { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .lean()

        return results
    }

    static async publishProductByShop({ shop, productId }: { shop: IShop, productId: any }) {
        const foundShop = await ProductModel.findOne({
            shop: shop,
            _id: productId
        });
        if (!foundShop) return null
        foundShop.isDraft = false;
        foundShop.isPublished = true;
        const { modifiedCount } = await foundShop.updateOne(foundShop);
        return {
            success: modifiedCount,
            message: `Product ${foundShop._id} published successfully`,
        }
    }

    static async unPublishProductbyShop({ shop, productId }: { shop: IShop, productId: any }) {
        const foundShop = await ProductModel.findOne({
            shop: shop,
            _id: productId
        });
        if (!foundShop) return null

        foundShop.isDraft = true;
        foundShop.isPublished = false;
        const { modifiedCount } = await foundShop.updateOne(foundShop);
        return modifiedCount;
    }


    static async findAllProducts({ limit, sort, page, filter, select }: { limit: number, sort: string, page: number, filter: any, select: any }) {
        const skip = (page - 1) * limit;
        const sortBy: { [key: string]: SortOrder } = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

        const products = await ProductModel.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(getSelectData(select))
            .lean()
        return products;
    }

    static async findProduct({ productId, unselect }: { productId: any, unselect?: string[] }) {
        return await ProductModel.findById(productId)
            .select(unGetSelectData(unselect))
    }

    static async updateProductById<TDocument extends Document, T>({
        product_id,
        payload,
        model,
        isNew = true
    }: {
        product_id: string
        payload: any
        model: Model<TDocument, {}, {}, {}, Document<unknown, {}, TDocument> & T & { _id: Types.ObjectId }, any>
        isNew?: boolean
    }) {
        return model.findOneAndUpdate({ _id: product_id }, payload, { new: isNew }).exec()
    }


    private static async queryProduct({ query, limit, skip }: { query: any, limit: number, skip: number }) {
        return await ProductModel.find(query)
            .populate('shop', 'name email -_id')
            .sort({ updateAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()
            .exec()
    }
}
