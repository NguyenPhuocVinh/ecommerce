import mongoose, { Document, model, Types } from "mongoose";
import { IDiscount } from "../types/discount.type";
import { DISCOUNT_APPLIES_TO, DISCOUNT_TYPE } from "../libs/contants/discoutType";

export interface DiscountDocument extends IDiscount, Document { };

// export interface IDiscount {
//     name: string,
//     description: string,
//     type: string,
//     value: number,
//     code: string,
//     start_date: Date,
//     end_date: Date,
//     max_uses: number,
//     uses_count: number,
//     users_used: string[],
//     max_uses_per_user: number,
//     min_uses_per_user: number,
//     shop: IShop,
//     is_active: boolean,
//     applies_to: string,
//     product_ids: string[],
// }

const DiscountSchema = new mongoose.Schema<DiscountDocument>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: Object.values(DISCOUNT_TYPE), default: DISCOUNT_TYPE.FIXED },
    value: { type: Number, required: true },
    code: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    max_uses: { type: Number, required: true },
    uses_count: { type: Number, default: 0 },
    users_used: [{ type: String, default: [] }],
    max_uses_per_user: { type: Number, required: true },
    min_order_value: { type: Number, required: true },
    shop: { type: Types.ObjectId, ref: 'Shop' },
    is_active: { type: Boolean, default: true },
    applies_to: { type: String, enum: Object.values(DISCOUNT_APPLIES_TO), default: DISCOUNT_APPLIES_TO.ALL },
    product_ids: [{ type: Types.ObjectId, ref: 'Product', default: [] }]
}, { timestamps: true })

export const DiscountModel = model<DiscountDocument>('Discount', DiscountSchema)