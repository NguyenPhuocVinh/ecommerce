import mongoose, { model, Model, Types } from "mongoose";
import { IInventory } from "../types/inventory.type";
// export interface IInventory {
//     product?: IProduct | string,
//     location: string,
//     stock: number,
//     shop?: IShop | string,
//     reservations: string[]
// }
export interface InventoryDocument extends IInventory, mongoose.Document { };

const InventorySchema = new mongoose.Schema<InventoryDocument>({
    product: {
        type: Types.ObjectId,
        ref: 'Product',
        required: true
    },
    location: {
        type: String,
        default: 'unKnow'
    },
    stock: {
        type: Number,
        required: true
    },
    shop: {
        type: Types.ObjectId,
        ref: 'Shop',
        required: true
    },
    reservations: [{
        type: String,
        default: []
    }]
}, { timestamps: true })

export const InventoryModel = model<InventoryDocument>('Inventory', InventorySchema)