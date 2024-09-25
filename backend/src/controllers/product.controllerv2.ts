import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { ProductService } from "../services/product.servicev2";
import cloudinary from "../configs/cloudinary.config";
import busboy from "busboy"
import { UploadService } from "../services/upload.service";
import { IProductCreatePayload } from "../types/product";
import { multipleUpload } from "../utils/upload.util";
import { unlink } from "fs/promises"
import { IProduct } from "../models/product/product.v2.model";

export class ProductController {

    //create
    static async createProduct(req: Request, res: Response) {
        try {
            multipleUpload(req, res, async (err) => {
                if (err) {
                    return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
                }

                const payload = req.body as IProductCreatePayload;
                const imageProduct = req.files['product[imageProduct]'];
                payload.product.image = await ProductController.handleImageUpload(imageProduct);

                payload.variant_list = await Promise.all(
                    payload.variant_list.map(async (variant, index) => {
                        const variantImages = req.files[`variant_list[${index}]imageVariant`] || [];
                        variant.image = await ProductController.handleImageUpload(variantImages);
                        return variant;
                    })
                );

                const newProduct = await ProductService.createProduct(payload);
                return res.status(StatusCodes.CREATED).json(newProduct);
            });
        } catch (error: any) {
            console.error('Error creating product:', error);
            return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    private static async handleImageUpload(images: any[]) {
        if (!images || images.length === 0) return [];
        const uploadResults = await UploadService.uploadImage(images);
        const imageUrls = uploadResults.map((response: any) => response.secure_url);
        await Promise.all(
            images.map(async (image) => {
                try {
                    await unlink(image.path);
                } catch (unlinkError) {
                    console.error('Error removing file:', unlinkError);
                }
            })
        );
        return imageUrls;
    };


    static async createVariant(req: Request, res: Response) {
        try {
            const product = await ProductService.createProduct(req.body)
            res.status(StatusCodes.CREATED).json(product)
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
        }
    }


    // static async uploadImageProduct(req: Request, res: Response) {
    //     const bb = busboy({ headers: req.headers });
    //     bb.on('file', async (fieldname: string, file: NodeJS.ReadableStream, filename: string, encoding: string, mimetype: string) => {
    //         // Create a promise that resolves when the file is uploaded to Cloudinary
    //         const cloudinaryUpload = new Promise((resolve, reject) => {
    //             const uploadStream = cloudinary.uploader.upload_stream(
    //                 { resource_type: 'auto' },
    //                 (error, result) => {
    //                     if (error) {
    //                         return reject(error);
    //                     }
    //                     resolve(result);
    //                 }
    //             );

    //             file.pipe(uploadStream);
    //         });

    //         try {
    //             const result = await cloudinaryUpload;
    //             const uploadResult = result as { secure_url: string };
    //             res.status(200).json({ message: 'File uploaded successfully', url: uploadResult.secure_url });
    //         } catch (error) {
    //             res.status(500).json({ error: 'File upload failed' });
    //         }
    //     });

    //     bb.on('finish', () => {
    //         console.log('Upload finished');
    //     });

    //     req.pipe(bb);
    // }


    //get publish
    static async getPublishProductWithVariantsAndAttributes(req: Request, res: Response) {
        try {
            const product = await ProductService.getPublishProductWithVariantsAndAttributes(req.params.productId);
            res.status(StatusCodes.OK).json(product);
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async getAllPublishProduct(req: Request, res: Response) {
        try {
            const { limit = 10, sort = 'asc', page = 1, filter = '{}', sortField = 'ctime' } = req.query;

            const products = await ProductService.getAllPublishProduct({
                limit: Number(limit),
                sort: String(sort),
                page: Number(page),
                filter: JSON.parse(String(filter)),
                sortField: String(sortField)
            });

            res.status(StatusCodes.OK).json(products);
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    //get all
    static async getProductWithVariantsAndAttributes(req: Request, res: Response) {
        try {
            const product = await ProductService.getProductWithVariantsAndAttributes(req.params.productId);
            res.status(StatusCodes.OK).json(product);
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async getAllProduct(req: Request, res: Response) {
        try {
            const { limit = 10, sort = 'asc', page = 1, filter = '{}', sortField = 'ctime' } = req.query;

            const products = await ProductService.getAllProduct({
                limit: Number(limit),
                sort: String(sort),
                page: Number(page),
                filter: JSON.parse(String(filter)),
                sortField: String(sortField)
            });

            res.status(StatusCodes.OK).json(products);
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    //Publish, ubPublish by shop
    static async publicProductByShop(req: Request, res: Response) {
        try {
            const { productIds } = req.body;
            const products = await ProductService.publicProductByShop(productIds);
            res.status(StatusCodes.OK).json(products);
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    static async unPublicProductByShop(req: Request, res: Response) {
        try {
            const { productIds } = req.body;
            const products = await ProductService.unPublicProductByShop(productIds);
            res.status(StatusCodes.OK).json(products);
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    //update 
    static async updateProduct(req: Request, res: Response) {
        try {
            const payload: Partial<IProduct> = req.body
            const products = await ProductService.updateProduct({
                productId: req.params.productId,
                payload: payload
            });
            res.status(StatusCodes.OK).json(products);
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    //delete
    static async deleteProduct(req: Request, res: Response) {
        try {
            const { productIds } = req.body;
            const products = await ProductService.deleteProduct(productIds);
            res.status(StatusCodes.OK).json(products);
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    //search
    static async searchProduct(req: Request, res: Response) {
        try {
            const products = await ProductService.searchProduct(req.query.q)
            res.status(StatusCodes.OK).json(products);
        } catch (error: any) {
            res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}
