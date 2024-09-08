import { StatusCodes } from "http-status-codes";
import { SkuModel } from "../models/product/sku.model";
import { ISku, SkuCreatePayload } from "../types/product.type";
import { ShopRepo } from "../repo/shop.repo";
import { ProductRepo } from "../repo/product.repo";

export class SkuService {
    static async createSku(spuList: SkuCreatePayload) {
        const newSku = await SkuModel.create({
            ...spuList,
            product: spuList.product
        });
        return newSku;
    }
}