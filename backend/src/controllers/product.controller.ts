import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { ProductService } from "../services/product.service";
import { SpuService } from "../services/spu.service";
import { SkuServiceV2 } from "../services/sku.service.v2";
import { ElasticService } from "../services/elastic.service";
import { multipleUpload } from "../utils/upload.util";
import cloudinary from "../configs/cloudinary.config";
import fs from "fs";


export class ProductController {
    //spu sku v2
    static async createSpu(req: Request, res: Response) {
        try {
            const spu = await SpuService.createSpu(req.body);
            return res.status(StatusCodes.CREATED).json(spu);
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }

    static async uploadImageSku(req: Request, res: Response) {
        multipleUpload(req, res, async (err: any) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
            }
            try {
                const files = req.files as Express.Multer.File[];
                const uploadResults = await SkuServiceV2.uploadImage({ files, skuId: req.params.skuId });
                return res.status(StatusCodes.CREATED).json(uploadResults);
            } catch (error: any) {
                res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
            }
        })
    }

    static async searchProduct(req: Request, res: Response) {
        try {
            const data = await SpuService.searchProducts({ keySearch: req.query.q })
            res.status(StatusCodes.OK).json(data)
        } catch (error: any) {
            res.status(error.statusCode).json({ error: error.message })
        }
    }

    static async searchProductV2(req: Request, res: Response) {
        try {
            const data = await ElasticService.searchProduct({ keySearch: req.query.q as string })
            res.status(StatusCodes.OK).json(data)
        } catch (error: any) {
            res.status(error.statusCode).json({ error: error.message })
        }
    }

    static async getOneSku(req: Request, res: Response) {
        try {
            const data = await SkuServiceV2.getOneSku({ spuId: req.params.spuId, skuId: req.params.skuId })
            res.status(StatusCodes.OK).json(data)
        } catch (error: any) {
            res.status(error.statusCode).json({ error: error.message })
        }
    }

    static async getPublishedSkus(req: Request, res: Response) {
        try {
            const data = await SkuServiceV2.getPublishedSkus()
            res.status(StatusCodes.OK).json(data)
        } catch (error: any) {
            res.status(error.statusCode).json({ error: error.message })
        }
    }

    static async findSpu(req: Request, res: Response) {
        try {
            const data = await SpuService.findSpu(req.params.spuId)
            res.status(StatusCodes.OK).json(data)
        } catch (error: any) {
            res.status(error.statusCode).json({ error: error.message })
        }
    }

    static async getAllSpu(req: Request, res: Response) {
        try {
            const data = await SpuService.getAllSpu()
            res.status(StatusCodes.OK).json(data)
        } catch (error: any) {
            res.status(error.statusCode).json({ error: error.message })
        }
    }

    //Start SPU, SKU

    // static async createSpu(req: Request, res: Response) {
    //     try {
    //         req.body.shop = req.user._id;
    //         const spu = await SpuService.createSpu(req.body);
    //         return res.status(StatusCodes.CREATED).json(spu);
    //     } catch (error: any) {
    //         res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
    //     }
    // }

    //END SPU, SKU
    static async createProduct(req: Request, res: Response) {
        try {
            req.body.shop = req.user._id;
            const product = await ProductService.createProduct(req.body.type, req.body);
            return res.status(StatusCodes.CREATED).json(product);
        } catch (error: any) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }

    //update
    static async updateProduct(req: Request, res: Response) {
        const data = await ProductService.updateProduct(
            req.body.type,
            req.params.productId,
            {
                ...req.body,
                shop: req.user._id
            })
        res.status(StatusCodes.CREATED).json(data)
    }

    static async publishProductByShop(req: Request, res: Response) {
        console.log(req.user._id)
        const data = await ProductService.publishProductByShop({ shop: req.user._id, productId: req.params.productId })
        res.status(StatusCodes.CREATED).json(data)
    }

    static async unPublishProductByShop(req: Request, res: Response) {
        const data = await ProductService.unPublishProductByShop({ shop: req.user._id, productId: req.params.productId })
        res.status(StatusCodes.CREATED).json(data)
    }

    //QUERY
    static async getAllDraftsForShop(req: Request, res: Response) {
        try {
            const data = await ProductService.findAllDraftsForShop({ shop: req.user._id })
            res.status(StatusCodes.OK).json(data)
        } catch (error: any) {
            res.status(error.statusCode).json({ error: error.message })
        }
    }

    static async getAllPublishForShop(req: Request, res: Response) {
        try {
            const data = await ProductService.findAllPublishForShop({ shop: req.user._id })
            res.status(StatusCodes.OK).json(data)
        } catch (error: any) {
            res.status(error.statusCode).json({ error: error.message })
        }
    }

    static async getListSearchProduct(req: Request, res: Response) {
        try {
            const data = await ProductService.searchProducts({ keySearch: req.params.q })
            res.status(StatusCodes.OK).json(data)
        } catch (error: any) {
            res.status(error.statusCode).json({ error: error.message })
        }
    }

    static async findAllProducts(req: Request, res: Response) {
        try {
            const data = await ProductService.findAllProducts(req.query);
            res.status(StatusCodes.OK).json(data);
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async findProduct(req: Request, res: Response) {
        try {
            const data = await ProductService.findProduct({ productId: req.params.productId });
            res.status(StatusCodes.OK).json(data);
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    //END QUERY
}
