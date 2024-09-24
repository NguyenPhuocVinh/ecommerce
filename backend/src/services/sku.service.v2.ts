import { StatusCodes } from "http-status-codes";
import { SkuModel } from "../models/product/sku.model";
import { ISku } from "../types/product.type";
import { ShopRepo } from "../repo/shop.repo";
import { ProductRepo } from "../repo/product.repo";
import { SpuRepo } from "../repo/spu.repo";
import { AppError } from "../erorrs/AppError.error";
import { CacheService } from "./cache.service";
import _ from "lodash";
import { UploadService } from "./upload.service";

export class SkuServiceV2 {
    static async createSku(sku: ISku) {
        const newSku = await SkuModel.create({
            ...sku,
            spuId: sku.spuId
        });
        return newSku;
    }

    static async uploadImage({ files, skuId }: { files: any[], skuId: string }) {
        const uploaded = await UploadService.uploadImage(files);
        const update = await SkuModel.updateOne({ _id: skuId }, { thumb: uploaded.map(file => file.secure_url) }, { new: true });
        return _.omit(update, ["createdAt", "updatedAt", "__v"]);
    }

    static async deleteSku(skuIds: string[]) {
        const deletedSku = await SkuModel.deleteMany({ _id: { $in: skuIds } })
        return deletedSku.deletedCount
    }

    static async deleteSkuBySpuId(spuId: string) {
        return await SkuModel.findOneAndDelete({ spuId })
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
        const foundSku = await SkuModel.findOne({ _id: skuId, spu: spuId });
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
        const skus = await SkuModel.find({ spu: spuId });
        return skus.map(sku => _.omit(sku, ["createdAt", "updatedAt", "__v"]));
    }

    static async getPublishedSkus() {
        const skus = await SkuModel.find();
        const fillerPub = skus.filter(sku => sku.isPublished === true && sku.isDraft === false);
        return fillerPub.map(sku => _.omit(sku, ["createdAt", "updatedAt", "__v"]));
    }
}