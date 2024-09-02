import mongoose, { Schema, Types } from "mongoose";
import { IOrder, OrderStatus } from "../types/order.type";

export interface OrderDocument extends IOrder, mongoose.Document {
    _id: mongoose.Types.ObjectId;
};

// export interface IOrder {
//     _id?: any
//     user?: any
//     checkout?: Checkout
//     shipping?: Shipping
//     payment?: OrderPayment
//     products?: IProduct[]
//     tracking?: string
//     status?: OrderStatus
// }

const OrderSchema = new mongoose.Schema<OrderDocument>({
    user: { type: Types.ObjectId, ref: 'User' },
    checkout: { type: Object, default: {} },
    shipping: { type: Object, default: {} },
    payment: { type: Object, default: {} },
    products: [{
        product: { type: Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 0 },
        price: { type: Number }
    }],
    tracking: { type: String, default: '' },
    status: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING }
}, { timestamps: true });

export const OrderModel = mongoose.model<OrderDocument>('Order', OrderSchema);