import { StatusCodes } from "http-status-codes";
import { ShopModel } from "../models";
import { AppError } from "../erorrs/AppError.error";

export class ShopRepo {
    static async foundShop(shopId: string) {
        const foundShop = await ShopModel.findById(shopId);
        if (!foundShop) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Shop not found');
        }
        return foundShop;
    }
}