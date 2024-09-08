import { ISpuM } from "../types/product.type";
import { SpuMModel } from "../models/product/spu.m";

export class SpuRepo {
    static async findSpu(spuId: string) {
        const spu = await SpuMModel.findById(spuId);
        return spu;
    }

    static async searchProductByUser({ keySearch }: { keySearch: any }) {
        const regexSearch = new RegExp(keySearch);
        const results = await SpuMModel.find({
            isPublished: true,
            $text: { $search: regexSearch.toString() }
        },
            { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .lean()

        return results
    }
}