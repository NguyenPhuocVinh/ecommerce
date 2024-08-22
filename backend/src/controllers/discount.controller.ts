import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { DiscountService } from "../services/discount.service";

export class DiscountController {
    static async createDiscountCode(req: Request, res: Response) {
        const data = await DiscountService.createDiscountCode(req.user, req.body)
        res.status(201).json({
            message: 'Discount code created successfully',
            data
        })
    }

    static async getAllProductsWithDiscountCode(req: Request, res: Response) {
        const { code, limit, page, shopId } = req.query;


        if (!code || !limit || !page || !shopId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Missing required query parameters: code, limit, page, shopId',
            });
        }

        const data = await DiscountService.getAllDiscountCodesWithProduct({
            code: code as string,
            shopId: shopId as string,
            limit: parseInt(limit as string),
            page: parseInt(page as string),
        });

        res.status(StatusCodes.OK).json({
            message: 'Get all products with discount code successfully',
            data,
        });
    }

    static async getAllDiscountsByShop(req: Request, res: Response) {
        const { shopId, limit, page } = req.query
        const data = await DiscountService.getAllDiscountsByShop({
            shopId: shopId as string,
            limit: parseInt(limit as string),
            page: parseInt(page as string),
        })
        res.status(StatusCodes.OK).json(data)
    }

    static async deleteDiscountCode(req: Request, res: Response) {
        const discount = await DiscountService.deleteDiscountCode({
            code: req.params.code,
            shopId: req.user._id
        })

        res.status(StatusCodes.OK).json({ message: `Delete success`, discount })
    }

    static async cancelDiscountCode(req: Request, res: Response) {
        const { shopId, code } = req.query
        const data = await DiscountService.cancelDiscountCode({
            code: code as string,
            shopId: shopId as string,
            userId: req.user._id
        })
        res.status(StatusCodes.OK).json(data)
    }

    static async getDiscountAmount(req: Request, res: Response) {
        const { code, products } = req.body;
        const data = await DiscountService.getDiscountAmount({
            code: code as string,
            products: products,
            shopId: req.query.shopId as string,
            userId: req.user._id
        })
        res.status(StatusCodes.OK).json(data)
    }
}