import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { CheckOutService } from "../services/checkout.service";
import { AppConfig } from "../configs/app.config";

export class CheckoutController {
    static async checkoutReview(req: Request, res: Response) {
        const { cartId, shop_order_ids } = req.body;
        if (!cartId || !shop_order_ids) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Missing required fields: cartId, userId, shop_order_ids');
        }

        const data = await CheckOutService.checkoutReview({ cartId, userId: req.user._id, shop_order_ids });
        res.status(StatusCodes.OK).json({
            message: 'Checkout review successfully',
            data
        });
    }

    static async orderByUser(req: Request, res: Response) {
        const { shop_order_ids_new, cartId, user_address, user_payment } = req.body;
        if (!shop_order_ids_new || !cartId || !user_address || !user_payment) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Missing required fields: shop_order_ids_new, cartId, userId, user_address, user_payment');
        }

        const data = await CheckOutService.orderByUser({ shop_order_ids_new, cartId, userId: req.user._id, user_address, user_payment });
        res.status(StatusCodes.CREATED).json({
            message: 'Order created successfully',
            data
        });
    }

    // static async getOrderByUser(req: Request, res: Response) {
    //     const userId = req.user._id;
    //     const data = await CheckOutService.getOrderByUser(userId);
    //     res.status(StatusCodes.OK).json({
    //         message: 'Get order by user successfully',
    //         data
    //     });
    // }
}


