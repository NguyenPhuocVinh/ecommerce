import mongoose from "mongoose";
import { IShop } from "../../types/auth.type";
import { SHOP_ROLE, SHOP_STATUS } from "../../libs/contants/shop";

export interface ShopDocument extends Omit<IShop, '_id'>, mongoose.Document { };

// export interface IShop {
//     name: string,
//     email: string,
//     password: string,
//     status: string,
//     role: [string]
// }   

// export enum ShopRole {
//     SHOP = 'shop',
//     WRITER = 'writer',
//     EDITOR = 'editor',
//     ADMIN = 'admin'
// }

// export enum ShopStatus {
//     OPEN = 'open',
//     CLOSE = 'close'
// }

const ShopSchema = new mongoose.Schema<ShopDocument>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(SHOP_STATUS)
    },
    role: [{
        type: String,
        required: true,
        enum: Object.values(SHOP_ROLE)
    }]
}, { timestamps: true })

export const ShopModel = mongoose.model<ShopDocument>('Shop', ShopSchema)