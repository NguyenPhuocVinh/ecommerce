import { StatusCodes } from "http-status-codes";
import { SpuModel } from "../models/product/spu.model";
import { ISpu, SpuCreatePayload } from "../types/product.type";
import { ShopRepo } from "../repo/shop.repo";
import { SkuService } from "./sku.service";

export class SpuService {
    // static async createSpu(payload: SpuCreatePayload) {
    //     // const { shop } = payload;
    //     const foundShop = await ShopRepo.foundShop(shop);
    //     const newSpu = await SpuModel.create({
    //         ...payload,
    //         shop: foundShop._id
    //     });

    //     if (newSpu && (payload.sku_list ?? []).length > 0) {
    //         for (const sku of payload.sku_list ?? []) {
    //             await SkuService.createSku({
    //                 ...sku,
    //                 product: newSpu._id.toString()
    //             });
    //         }
    //     }
    //     return newSpu;
    // }
}