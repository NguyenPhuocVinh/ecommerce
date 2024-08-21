import { AppError } from "../erorrs/AppError.error";
import { StatusCodes } from "http-status-codes";
import { DiscountModel } from "../models/discount.model";
import { IDiscount } from "../types/discount.type";
import { IShop } from "../types/auth.type";
import { DISCOUNT_APPLIES_TO } from "../libs/contants/discoutType";
import { ProductRepo } from "../repo/product.repo";
import { ShopModel } from "../models";
import { Types } from "mongoose";
import { DiscountRepo } from "../repo/discount.repo";

export class DiscountService {
    static async createDiscountCode(shopId: string, payload: IDiscount) {
        const { code, shop, start_date, end_date } = payload;
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date))
            throw new AppError(StatusCodes.BAD_GATEWAY, `Discount code has expried!`)

        if (new Date(start_date) >= new Date(end_date))
            throw new AppError(StatusCodes.BAD_REQUEST, `Start date must be before end date`)
        const foundDiscount = await DiscountModel.findOne({
            code,
            shop
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
        { code, shop, userId, limit, page }
            :
            { code: string, shop: IShop, userId: string, limit: number, page: number }
    ) {
        const foundDiscount = await DiscountModel.findOne({
            code,
            shop
        }).lean();

        if (!foundDiscount || !foundDiscount.is_active)
            throw new AppError(StatusCodes.NOT_FOUND, `Discount not found`);

        const { applies_to, product_ids } = foundDiscount;
        let products;
        if (applies_to === DISCOUNT_APPLIES_TO.ALL) {
            products = await ProductRepo.findAllProducts({
                filter: {
                    shop,
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
        limit = 50,
        page = 1,
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
}