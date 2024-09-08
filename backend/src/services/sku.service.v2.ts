import { StatusCodes } from "http-status-codes";
import { SkuMModel } from "../models/product/sku.m";
import { ISkuM } from "../types/product.type";
import { ShopRepo } from "../repo/shop.repo";
import { ProductRepo } from "../repo/product.repo";
import { SpuRepo } from "../repo/spu.repo";
import { AppError } from "../erorrs/AppError.error";
import { CacheService } from "./cache.service";
import _ from "lodash";

export class SkuServiceV2 {
    static async createSku(sku: ISkuM) {
        const newSku = await SkuMModel.create({
            ...sku,
            spu: sku.spu
        });
        return newSku;
    }

    static async getOneSku({ spuId, skuId }: { spuId: string, skuId: string }) {
        // Check cache first
        const cacheKey = `spu-${spuId}-sku-${skuId}`;
        const cachedData = CacheService.get<{ spu: any, sku: any }>(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        // Fetch SPU from repository
        const foundSpu = await SpuRepo.findSpu(spuId);
        if (!foundSpu) throw new AppError(StatusCodes.NOT_FOUND, "Product not found");

        // Fetch SKU from repository
        const foundSku = await SkuMModel.findOne({ _id: skuId, spu: spuId });
        if (!foundSku) throw new AppError(StatusCodes.NOT_FOUND, "SKU not found");

        // Set cache
        const skuData = {
            // spu: foundSpu,
            sku: foundSku
        };
        CacheService.set(cacheKey, skuData);

        return _.omit(skuData.sku, ["createdAt", "updatedAt", "__v"]);
    }

    static async getSkusBySpuId(spuId: string) {
        const skus = await SkuMModel.find({ spu: spuId });
        return skus.map(sku => _.omit(sku, ["createdAt", "updatedAt", "__v"]));
    }


}