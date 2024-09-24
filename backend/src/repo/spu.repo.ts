import { ISpu } from "../types/product.type";
import { SpuModel } from "../models/product/spu.model";

export class SpuRepo {
    static async findSpu(spuId: string) {
        const spu = await SpuModel.findById(spuId);
        return spu;
    }

    static async searchProductByUser({ keySearch }: { keySearch: any }) {
        const regexSearch = new RegExp(keySearch);
        const results = await SpuModel.find({
            isPublished: true,
            $text: { $search: regexSearch.toString() }
        },
            { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .lean()

        return results
    }

}