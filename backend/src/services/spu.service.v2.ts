import { StatusCodes } from "http-status-codes";
import { SpuMModel } from "../models/product/spu.m";
import { ISkuM, ISpuM, SpuCreatePayload } from "../types/product.type";
import { SkuServiceV2 } from "./sku.service.v2";
import { CacheService } from "./cache.service";
import { AppError } from "../erorrs/AppError.error";
import _ from "lodash";
import { SpuRepo } from "../repo/spu.repo";

export class SpuServiceV2 {
    static async createSpuV2(payload: SpuCreatePayload) {
        const { spu, sku_list } = payload;

        // Create SPU
        const newSpu = await SpuMModel.create(spu);

        // Create SKUs
        if (newSpu && sku_list.length > 0) {
            const skuPromises = sku_list.map(sku =>
                SkuServiceV2.createSku({
                    ...sku,
                    spu: newSpu._id.toString() // Ensure the SKU references the created SPU
                })
            );
            await Promise.all(skuPromises);
        }

        return newSpu;
    }

    static async findSpu(spuId: string) {
        const cacheKey = `spu-${spuId}`;
        const cachedData = CacheService.get<{ spu: ISpuM }>(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const foundSpu = await SpuMModel.findById(spuId);
        if (!foundSpu) throw new AppError(StatusCodes.NOT_FOUND, "SPU not found");
        const skus = await SkuServiceV2.getSkusBySpuId(spuId);
        const infoSpu = _.omit(foundSpu, ["createdAt", "updatedAt", "__v"]);
        const spuData = {
            spu: infoSpu,
            skus
        };
        CacheService.set(cacheKey, spuData);
        return spuData;
    }

    static async getAllSpu() {
        const spus = await SpuMModel.find();
        const spuData = spus.map(spu => _.omit(spu, ["createdAt", "updatedAt", "__v"]));
        return spuData;
    }

    static async searchProducts({ keySearch }: { keySearch: any }) {
        return await SpuRepo.searchProductByUser({ keySearch })
    }
}
