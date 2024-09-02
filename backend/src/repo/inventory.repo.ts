import { InventoryModel } from "../models/inventory.model";
import { IShop } from "../types/auth.type";
import { IProduct } from "../types/product.type";

export class InventoryRepo {
    static async insertInventory({
        product,
        shop,
        stock,
        location = 'unKnow'
    }: {
        product: string,
        shop: IShop,
        stock: number,
        location?: string
    }) {
        return await InventoryModel.create({
            product,
            shop,
            stock,
            location
        })
    }

    static async reserveInventory({
        productId,
        quantity,
        cartId
    }: {
        productId: string
        quantity: number
        cartId: string
    }) {

        const query = {
            product: productId,
            stock: { $gte: quantity }
        }
        const updateSet = {
            $inc: { stock: -quantity },
            $push: {
                reservations: {
                    cartId,
                    quantity,
                    create_on: new Date()
                }
            }
        }
        const options = { new: true, upsert: true }
        return InventoryModel.findOneAndUpdate(query, updateSet, options)
    }

}