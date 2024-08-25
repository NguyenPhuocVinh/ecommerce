import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { CartService, ICartItem } from "../services/cart.service";

export class CartController {


    static async addToCartV2(req: Request, res: Response) {
        const userId = req.user._id
        const product: ICartItem = req.body
        const userCart = await CartService.addToCartV2({ userId, product })
        return res.status(StatusCodes.CREATED).json(userCart)
    }


}