import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { CART_STATE } from "../libs/contants/cartType";
import { CartModel } from "../models/cart.model";
import { IProduct } from "../types/product.type";
import { QueryFilter } from "../utils/filter.util";
import { ICartItem } from "../services/cart.service";
import { ProductRepo } from "./product.repo";

export class CartRepo {

    static async createCartV2({ userId, product }: { userId: string; product: ICartItem }) {
        const filter: QueryFilter = { userId, state: CART_STATE.ACTIVE };
        const update = {
            $push: { products: product },
            $inc: { count_products: +1 }
        };
        const options = { new: true, upsert: true };
        return CartModel.findOneAndUpdate(filter, update, options);
    }

    static async updateProductQuantity({ userId, product }: { userId: string, product: ICartItem }) {
        const filter: QueryFilter = { userId, state: CART_STATE.ACTIVE, 'products.productId': product.productId };
        const projection = {
            'products.$': 1
        };

        const update = {
            $inc: { 'products.$.quantity': product.quantity }
        }
        const options = { new: true };
        const foundProduct = await CartModel.findOne(filter, projection);
        if (foundProduct && foundProduct.products[0].quantity + product.quantity <= 0) {
            // tạo 1 toast thông báo
            product.quantity = foundProduct.products[0].quantity;
            return this.deleteProductFromCart({ userId, product });
        }
        await ProductRepo.updateProductQuantity({ product, type: 'SUB' })
        return CartModel.findOneAndUpdate(filter, update, options);
    }

    static async addNewProductToCart({ userId, product }: { userId: string; product: ICartItem }) {
        const { quantity, productId, shopId } = product
        if (quantity <= 0) {
            throw new AppError(StatusCodes.BAD_REQUEST, 'Quantity must be greater than 0')
        }

        await ProductRepo.updateProductQuantity({ product, type: 'SUB' })

        const filter: QueryFilter = { userId, state: CART_STATE.ACTIVE }
        const update = {
            $push: { products: { productId: product.productId, quantity: product.quantity } },
            $inc: { count_products: 1 }
        }
        const options = { new: true }
        return await CartModel.findOneAndUpdate(filter, update, options)
    }

    static async deleteProductFromCart({ userId, product }: { userId: string; product: ICartItem }) {

        const filter: QueryFilter = { userId, state: CART_STATE.ACTIVE }
        const update = {
            $pull: {
                products: {
                    productId: product.productId
                }
            },
            $inc: { count_products: -1 }
        }
        const options = { new: true }
        await ProductRepo.updateProductQuantity({ product, type: 'ADD' })
        return CartModel.findOneAndUpdate(filter, update, options)
    }

    static async getListCarts(userId: string) {
        const filter: QueryFilter = { userId, state: CART_STATE.ACTIVE }
        return CartModel.findOne(filter).populate('products')
    }

    static async findCartById(cartId: string) {
        const cart = await CartModel.findOne({ _id: cartId, state: CART_STATE.ACTIVE }).populate('products')
        if (!cart) {
            throw new AppError(StatusCodes.NOT_FOUND, 'Cart not found')
        }
        return cart
    }

}