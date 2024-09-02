import { StatusCodes } from 'http-status-codes'
import { InventoryModel } from '../models/inventory.model'
import { ProductRepo } from '../repo/product.repo'
import { AppError } from '../erorrs/AppError.error'

interface AddStockDto {
    stock: number
    productId: string
    shopId: string
    location?: string
}

export class InventoryService {
    static async addStockToInventory({ stock, productId, shopId, location = 'HCM City' }: AddStockDto) {
        const product = await ProductRepo.findProduct({
            productId,
            unselect: ['_id', 'name', 'price', 'quantity', 'shop_id']
        })
        if (!product) throw new AppError(StatusCodes.NOT_FOUND, 'Product not found')

        const query = { shop: shopId, product: productId }
        const update = { $inc: { quantity: stock }, $set: { location } }
        const options = { upsert: true, new: true }

        return InventoryModel.findOneAndUpdate(query, update, options)
    }
}
