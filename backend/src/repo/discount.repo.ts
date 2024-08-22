import { StatusCodes } from "http-status-codes"
import { AppError } from "../erorrs/AppError.error"
import { DiscountModel } from "../models/discount.model"
import { getSelectData, QueryFilter } from "../utils/filter.util"

export class DiscountRepo {
    static async getAllDiscounts({
        limit = 50,
        page = 1,
        sort = 'ctime',
        filter = {},
        select
    }: {
        limit?: number
        page?: number
        sort?: string
        filter?: QueryFilter
        select?: string[]
    }) {
        const skip = (page - 1) * limit
        const sortBy: Record<string, -1 | 1> = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
        return DiscountModel.find(filter)
            .sort(sortBy)
            .select(getSelectData(select))
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'product_ids',
                select: 'name'
            })
            .lean()
    }

    static async checkDiscountExists({ code, shopId }: { code: string, shopId: string }) {
        const foundDiscount = await DiscountModel.findOne({ code, shop: shopId }).lean();
        if (!foundDiscount)
            throw new AppError(StatusCodes.NOT_FOUND, `Discount not found`);
        return foundDiscount;
    }
}