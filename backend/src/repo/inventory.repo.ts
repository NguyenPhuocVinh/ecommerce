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
}