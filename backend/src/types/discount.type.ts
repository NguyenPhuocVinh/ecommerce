import { IShop } from "./auth.type";

export interface IDiscount {
    name: string,
    description: string,
    type?: string,
    value: number,
    code: string,
    start_date: Date,
    end_date: Date,
    max_uses?: number,
    uses_count?: number,
    users_used?: string[],
    max_uses_per_user?: number,
    min_order_value?: number,
    shop: IShop,
    is_active?: boolean,
    applies_to?: string,
    product_ids?: string[],
}