import { StatusCodes } from "http-status-codes";
import { SpuModel } from "../models/product/spu.model";
import { ISku, ISpu, SpuCreatePayload } from "../types/product.type";
import { SkuServiceV2 } from "./sku.service.v2";
import { CacheService } from "./cache.service";
import { AppError } from "../erorrs/AppError.error";
import _ from "lodash";
import { SpuRepo } from "../repo/spu.repo";
import { UploadService } from "./upload.service";

export class SpuService {
    static async createSpu(payload: SpuCreatePayload) {
        const { spu, sku_list } = payload;

        const newSpu = await SpuModel.create(spu);

        if (newSpu && sku_list.length > 0) {
            const skuPromises = sku_list.map(sku =>
                SkuServiceV2.createSku({
                    ...sku,
                    spuId: newSpu._id.toString()
                })
            );
            await Promise.all(skuPromises);
        }

        return newSpu;
    }

    static async uploadImageSpu({ files, spuId }: { files: any, spuId: string }) {
        const uploaded = await UploadService.uploadImage(files);
        const update = await SpuModel.findByIdAndUpdate(spuId, { thumb: uploaded.map(file => file.secure_url) }, { new: true })
        return _.omit(update, ["createdAt", "updatedAt", "__v"])
    }

    static async deleteSpu(spuId: string) {
        await SkuServiceV2.deleteSkuBySpuId(spuId)
        return await SpuModel.findByIdAndDelete(spuId)
    }

    static async findSpu(spuId: string) {
        const cacheKey = `spu-${spuId}`;
        const cachedData = CacheService.get<{ spu: ISpu }>(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        const foundSpu = await SpuModel.findById(spuId);
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
        const spus = await SpuModel.find();
        const spuData = spus.map(spu => _.omit(spu, ["createdAt", "updatedAt", "__v"]));
        return spuData;
    }

    static async searchProducts({ keySearch }: { keySearch: any }) {
        return await SpuRepo.searchProductByUser({ keySearch })
    }
}
