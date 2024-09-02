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
    name?: string,
    price?: number,
    quantity: number;
    shopId?: string;
}

export class CartService {
    static async addToCartV2({ userId, product }: { userId: string; product: ICartItem }) {
        let { productId, quantity } = product;
        const foundProduct = await ProductRepo.findProduct({ productId });
        if (foundProduct) {
            if (foundProduct.quantity < quantity)
                throw new AppError(StatusCodes.BAD_REQUEST, `Quantity must be < quantity in stock`)
            else {
                product.name = foundProduct.name,
                    product.price = foundProduct.price
            }
        }

        const userCart = await CartModel.findOne({ userId, state: CART_STATE.ACTIVE });

        if (!userCart) {
            return await CartRepo.createCartV2({ userId, product });
        }

        const foundProductCart = userCart.products.find(p => p.productId === productId)
        if (foundProductCart) {
            return await CartRepo.updateProductQuantity({ userId, product });
        } else {
            return await CartRepo.addNewProductToCart({ userId, product });
        }
    }

    static async removeProductCart({ userId, product }: { userId: string, product: ICartItem }) {
        await CartRepo.deleteProductFromCart({ userId, product })
        return await CartRepo.getListCarts(userId)
    }

    static async getCart(userId: string) {
        return CartRepo.getListCarts(userId);
    }

}