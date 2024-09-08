import { IUser } from "./auth.type"
import { IProduct } from "./product.type"

export interface IComment {
    productId: IProduct
    userId: IUser
    content: string
    left: number
    right: number
    parentId?: any
    isDeleted?: boolean
}