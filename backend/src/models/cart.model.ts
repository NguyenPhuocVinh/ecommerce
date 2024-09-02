import mongoose, { Document, model, Schema, Types } from "mongoose";
import { ICart } from "../types/cart.type";
import { CART_STATE } from "../libs/contants/cartType";

// export interface ICart {
//     state: string[],
//     products: string[],
//     count_product: number,
//     userId: string
// }

export interface CartDocument extends ICart, Document { };

const CartSchema = new Schema<CartDocument>({
    state: { type: String, required: true, enum: Object.values(CART_STATE), default: CART_STATE.ACTIVE },
    products: [
        {
            productId: { type: String, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            shopId: { type: String, required: true },
        }
    ],
    count_product: { type: Number, default: 0 },
    userId: { type: Types.ObjectId, ref: 'User' }
}, { timestamps: true });


// CartSchema.pre('findOneAndUpdate', async function (next) {
//     const cart = await this.model.findOne(this.getQuery())
//     if (cart) {
//         cart.count_products = cart.products.length
//         await cart.save()
//     }
//     next()
// })
export const CartModel = model<CartDocument>('Cart', CartSchema);