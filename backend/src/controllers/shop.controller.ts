import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { IShop } from "../types/auth.type";
import { AppError } from "../erorrs/AppError.error";
import { ShopService } from "../services/shop.service";
export class ShopController {
    static async register(req: Request, res: Response) {
        const shop = await ShopService.register(req.body);
        return res.status(StatusCodes.CREATED).json(shop)
    }

    static async login(req: Request, res: Response) {
        const body = req.body as Pick<IShop, 'email' | 'password'>;
        if (!body.email)
            throw new AppError(StatusCodes.BAD_REQUEST, `Email is required`);

        if (!body.password)
            throw new AppError(StatusCodes.BAD_REQUEST, `Password is required`);
        const shop = await ShopService.loggin(body);
        return res.status(StatusCodes.OK).json(shop)
    }

    static async logout(req: Request, res: Response) {
        await ShopService.logout(req.keyStore);
        res.status(StatusCodes.OK).json({ message: 'Logout success' })
    }

    static async refreshToken(req: Request, res: Response) {
        try {
            const shop = await ShopService.refreshToken({
                refreshToken: req.refreshToken as string,
                user: req.user
            });
            return res.status(StatusCodes.OK).json(shop)
        } catch (error: any) {
            res.status(error.statusCode).json({ message: error.message })
        }
    }
}