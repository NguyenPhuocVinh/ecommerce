import { IProduct } from "./product.type"

export interface Checkout {
    total_price: number
    total_apply_discount: number
    fees_ship: number
}

export interface Shipping {
    street: string
    city: string
    state: string
    country: string
}

export interface OrderPayment {
    method: string
    status: string
}

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCEL = 'CANCEL',
    DELIVERED = 'DELIVERED',
    COMPLETED = 'COMPLETED'
}

export interface IOrder {
    _id?: any
    user?: any
    checkout?: Checkout
    shipping?: Shipping
    payment?: OrderPayment
    products?: IProduct[]
    tracking?: string
    status?: OrderStatus
}
