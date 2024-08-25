import { ICartItem } from "../services/cart.service"

export interface ICart {
    state: string,
    products: ICartItem[],
    count_product: number,
    userId: any
}

export interface IShopOrder {
    shopId: string
    item_products: {
        quantity: number
        old_quantity: number
        price: number
        shopId: string
        productId: string
    }[]
}