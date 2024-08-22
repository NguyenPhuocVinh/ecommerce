import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import { DiscountModel } from "../models/discount.model";
import { IDiscount } from "../types/discount.type";
import { IShop } from "../types/auth.type";
import { DISCOUNT_APPLIES_TO, DISCOUNT_TYPE } from "../libs/contants/discoutType";
import { ProductRepo } from "../repo/product.repo";
import { ShopModel } from "../models";
import { Types } from "mongoose";
import { DiscountRepo } from "../repo/discount.repo";
import { IProduct } from "../types/product.type";

export class DiscountService {
    static async createDiscountCode(shopId: string, payload: IDiscount) {
        const { code, start_date, end_date } = payload;
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date))
            throw new AppError(StatusCodes.BAD_GATEWAY, `Discount code has expried!`)

        if (new Date(start_date) >= new Date(end_date))
            throw new AppError(StatusCodes.BAD_REQUEST, `Start date must be before end date`)
        const foundDiscount = await DiscountModel.findOne({
            code,
            shop: shopId
        })
        if (foundDiscount && foundDiscount.is_active)
            throw new AppError(StatusCodes.BAD_REQUEST, `Discount exited`)

        const newDiscount = await DiscountModel.create({
            ...payload,
            shop: shopId
        })
        return newDiscount
    }

    static async getAllDiscountCodesWithProduct(
        { code, shopId, limit, page }
            :
            { code: string, shopId: string, limit: number, page: number }
    ) {
        const foundDiscount = await DiscountModel.findOne({
            code,
            shop: shopId
        }).lean();

        if (!foundDiscount || !foundDiscount.is_active)
            throw new AppError(StatusCodes.NOT_FOUND, `Discount not found`);

        const { applies_to, product_ids } = foundDiscount;
        let products;
        if (applies_to === DISCOUNT_APPLIES_TO.ALL) {
            products = await ProductRepo.findAllProducts({
                filter: {
                    shop: shopId,
                    isPublished: true
                },
                limit: +limit,
                sort: 'ctime',
                page: +page,
                select: ['name']
            });
        }

        if (applies_to === DISCOUNT_APPLIES_TO.PRODUCT) {
            products = await ProductRepo.findAllProducts({
                filter: {
                    _id: { $in: product_ids },
                    isPublished: true

                },
                limit: +limit,
                sort: 'ctime',
                page: +page,
                select: ['name']
            })
        }

        return products;
    }


    static async getAllDiscountsByShop({
        shopId,
        limit,
        page,
        sort = 'ctime'
    }: {
        shopId: string
        limit?: number
        page?: number
        sort?: string
    }) {
        const shop = await ShopModel.findOne({ _id: new Types.ObjectId(shopId) }).lean()
        if (!shop) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Shop not found')
        }

        return DiscountRepo.getAllDiscounts({
            filter: { shop: shopId },
            select: ['name', 'description', 'code', 'start_date', 'end_date', 'applies_to', 'product_ids'],
            limit,
            page,
            sort
        })
    }

    static async getDiscountAmount(
        { code, userId, shopId, products }
            :
            { code: string, userId: string, shopId: string, products: Partial<IProduct>[] }
    ) {
        const foundDiscount = await DiscountRepo.checkDiscountExists({ code, shopId });
        const { start_date, end_date, is_active, max_uses, min_order_value, max_uses_per_user,
            users_used, type, value }
            = foundDiscount;
        if (!is_active)
            throw new AppError(StatusCodes.BAD_REQUEST, `Discount code is not active`);

        if (!max_uses || max_uses < 1)
            throw new AppError(StatusCodes.BAD_REQUEST, `Discount code has expired`);

        if (new Date < new Date(start_date) || new Date > new Date(end_date))
            throw new AppError(StatusCodes.BAD_REQUEST, `Discount code has expired`);

        let totalOrder = 0;
        if (min_order_value && min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (Number(product.price) * Number(product.quantity))
            }, 0)
            if (totalOrder < min_order_value)
                throw new AppError(StatusCodes.BAD_REQUEST, `Minimum order value is ${min_order_value}`)
        }
        if (max_uses_per_user && max_uses_per_user > 0) {
            if (users_used?.includes(userId))
                throw new AppError(StatusCodes.BAD_REQUEST, `Discount code has been used by you`)
        }

        const amount = type === DISCOUNT_TYPE.FIXED ? value : totalOrder * (value / 100);
        return {
            totalOrder, discount: amount, totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({ code, shopId }: { code: string, shopId: string }) {
        const deleted = await DiscountModel.findOneAndDelete({ code, shop: shopId });
        if (!deleted)
            throw new AppError(StatusCodes.NOT_FOUND, `Discount code not found`);
        return deleted;
    }

    static async cancelDiscountCode({ code, shopId, userId }: { code: string, shopId: string, userId: string }) {
        const foundDiscount = await DiscountRepo.checkDiscountExists({ code, shopId });
        const result = await DiscountModel.findOneAndUpdate(
            { code, shop: shopId },
            {
                $pull: { users_used: userId },
                $inc: {
                    max_uses: 1,
                    uses_count: -1
                }
            },
            { new: true }
        )
        return result;
    }

}