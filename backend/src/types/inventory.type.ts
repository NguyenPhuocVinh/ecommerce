import { IShop } from "./auth.type"
import { IProduct } from "./product.type"
export interface IInventory {
    product?: IProduct | string,
    location: string,
    stock: number,
    shop?: IShop | string,
    reservations: string[]
}