import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { ProductService } from "../services/product.service";

export class ProductController {
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
