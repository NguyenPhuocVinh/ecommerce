import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { ProductRepo } from "../repo/product.repo";
import { CartRepo } from "../repo/cart.repo";
import { ICartItem } from "./cart.service";
import { DiscountService } from "./discount.service";
import { OrderPayment } from "../types/order.type";
import { RedisService } from "./redis.service";
import { OrderModel } from "../models/order.model";
import { CheckoutRepo } from "../repo/checkout.repo";

interface ShopOrderIds {
    shopId: string;
    shop_discount: any[];
    item_products: ICartItem[];
}

export class CheckOutService {
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }: {
        cartId: string;
        userId: string;
        shop_order_ids: ShopOrderIds[];
    }) {
        try {
            const foundCart = await CartRepo.findCartById(cartId);

            const checkoutOrder = {
                totalPrice: 0,
                feeShip: 0,
                totalDiscount: 0,
                totalCheckout: 0
            };

            const shop_order_ids_new = [];

            for (const { shopId, shop_discount = [], item_products = [] } of shop_order_ids) {
                const cartProducts = foundCart.products.filter(cartItem =>
                    item_products.some(item => item.productId === cartItem.productId)
                );

                if (cartProducts.length === 0) {
                    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found in cart');
                }
                const checkProductServer = await ProductRepo.checkProductByServer(item_products);
                if (checkProductServer.length === 0) {
                    throw new AppError(StatusCodes.NOT_FOUND, 'Product not found');
                }

                const checkoutPrice = checkProductServer.reduce((acc, cur) => {
                    const cartItem = cartProducts.find(item => item.productId === cur.product_id);
                    if (cartItem) {
                        return acc + cur.price * cartItem.quantity;
                    }
                    return acc;
                }, 0);

                for (let i = 0; i < cartProducts.length; i++) {
                    cartProducts[i].price = checkProductServer.find(item => item.product_id === cartProducts[i].productId)?.price || 0;
                }

                checkoutOrder.totalPrice += checkoutPrice;

                const itemCheckout = {
                    shopId,
                    shop_discount,
                    price_raw: checkoutPrice,
                    price_apply_discount: checkoutPrice,
                    item_products: cartProducts
                };

                if (shop_discount.length > 0) {
                    for (const discounts of shop_discount) {
                        const { discount = 0 } = await DiscountService.getDiscountAmount({
                            code: discounts.code,
                            shopId,
                            userId,
                            products: cartProducts
                        });

                        checkoutOrder.totalDiscount += discount;

                        if (discount > 0) {
                            itemCheckout.price_apply_discount = checkoutPrice - discount;
                        }
                    }
                }

                checkoutOrder.totalCheckout += itemCheckout.price_apply_discount;
                shop_order_ids_new.push(itemCheckout);
            }

            return {
                shop_order_ids,
                shop_order_ids_new,
                checkoutOrder
            };
        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

    static async orderByUser({
        shop_order_ids_new,
        cartId,
        userId,
        user_address = {},
        user_payment
    }: {
        shop_order_ids_new: any[];
        cartId: string;
        userId: string;
        user_address: any;
        user_payment: OrderPayment;
    }) {
        try {
            const { checkoutOrder } = await this.checkoutReview({
                cartId,
                userId,
                shop_order_ids: shop_order_ids_new
            });

            const products = shop_order_ids_new.flatMap(order => order.item_products.map((item: ICartItem) => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price
            })));

            const acquireProduct = [];
            for (const { productId, quantity } of shop_order_ids_new.flatMap(order =>
                order.item_products,
            )) {
                const keyLock = await RedisService.acquireLock({
                    productId,
                    quantity,
                    cartId
                });
                acquireProduct.push(keyLock ? true : false);
                if (keyLock) {
                    await RedisService.releaseLock(keyLock);
                }
            }

            if (acquireProduct.includes(false)) {
                throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to acquire lock for one or more products.');
            }

            // const orders = await OrderModel.create({
            //     user: userId,
            //     checkout: checkoutOrder,
            //     shipping: user_address,
            //     payment: user_payment,
            //     products: products
            // });

            for (const product of products) {
                const deleteProductFromCart = await CartRepo.deleteProductFromCart({ userId, product });
                console.log('deleteProductFromCart', deleteProductFromCart);
            }

            // return orders;
            return products;


        } catch (error: any) {
            throw new AppError(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR, error.message);
        }
    }

}
