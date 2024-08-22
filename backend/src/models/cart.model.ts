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
    products: [{
        type: String
    }],
    count_product: { type: Number, default: 0 },
    userId: { type: String, required: true }
}, { timestamps: true })

export const CartModel = model<CartDocument>('Cart', CartSchema);