import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { CartModel } from "../models/cart.model";
import { IShopOrder } from "../types/cart.type";
import { ProductRepo } from "../repo/product.repo";
import { CartRepo } from "../repo/cart.repo";
import { CART_STATE } from "../libs/contants/cartType";
import { QueryFilter } from "../utils/filter.util";

export interface ICartItem {
    productId: string;
    quantity: number;
    shopId?: string;
}

export class CartService {


    static async addToCartV2({ userId, product }: { userId: string; product: ICartItem }) {
        const userCart = await CartModel.findOne({ userId, state: CART_STATE.ACTIVE });

        if (!userCart) {
            return CartRepo.createCartV2({ userId, product });
        }
        const foundProduct = userCart.products.find(p => p.productId === product.productId)
        if (foundProduct) {
            return CartRepo.updateProductQuantity({ userId, product });
        } else {
            return CartRepo.addNewProductToCart({ userId, product });
        }
    }


}