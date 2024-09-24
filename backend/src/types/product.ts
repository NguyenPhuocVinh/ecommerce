import { IProduct } from "../models/product/product.v2.model";
import { IVariant } from "../models/product/variant.model";

export interface IProductCreatePayload {
    product: IProduct;
    variant_list: IVariant[]
}