import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { CartService, ICartItem } from "../services/cart.service";

export class CartController {


    static async addToCartV2(req: Request, res: Response) {
        try {
            const userId = req.user._id
            const product: ICartItem = req.body
            const userCart = await CartService.addToCartV2({ userId, product })
            return res.status(StatusCodes.CREATED).json(userCart)
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
        }
    }

    static async removeProductFromCart(req: Request, res: Response) {
        try {
            const deleted = await CartService.removeProductCart({ userId: req.user._id, product: req.body })
            res.status(StatusCodes.OK).json(deleted)
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message })
        }
    }


    static async getCart(req: Request, res: Response) {
        const userId = req.user._id;
        const listCart = await CartService.getCart(userId);
        res.status(StatusCodes.OK).json(listCart)
    }

}