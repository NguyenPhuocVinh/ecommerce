import { StatusCodes } from "http-status-codes";
import { AppError } from "../erorrs/AppError.error";
import { IProduct, ProductModel } from "../models/product/product.v2.model";
import { IVariant, VariantModel } from "../models/product/variant.model";
import { IProductCreatePayload } from "../types/product";
import _ from "lodash";
import { SortOrder, Types } from "mongoose";
import { ElasticService } from "./elastic.service";

export class ProductService {

    //Create
    static async createProduct(payload: IProductCreatePayload) {
        const { product, variant_list } = payload;
        const newProduct = await ProductModel.create(product);

        if (variant_list && variant_list.length > 0) {

            const variantPromises = variant_list.map((variant) => {
                return this.createVariant({
                    ...variant,
                    productId: newProduct._id
                });
            });

            const newVariants = await Promise.all(variantPromises);
            const populatedVariants = await Promise.all(
                newVariants.map(async (variant) => {
                    return await VariantModel.findById(variant._id).populate('attributes.value').exec();
                })
            );
            await ElasticService.createData(newProduct)
            return {
                product: {
                    product: newProduct,
                    variants: populatedVariants
                }
            };
        }
        await ElasticService.createData(newProduct)
        return newProduct;
    }


    static async createVariant(payload: IVariant) {
        const { productId } = payload
        const newVariant = await VariantModel.create(payload)
        return _.omit(newVariant, ['createAt', 'updateAt', '__v'])
    }


    //get publish
    static async getPublishProductWithVariantsAndAttributes(productId: string) {
        const product = await ProductModel.findOne({ _id: productId, isPublish: true }).exec();
        if (!product) {
            throw new AppError(StatusCodes.NOT_FOUND, `Product not found`);
        };

        const variants = await VariantModel.find({ productId, isPublish: true }).populate('attributes.value').exec();
        return {
            product,
            variants
        };
    }

    static async getAllPublishProduct({ limit, sort, page, filter, sortField }:
        { limit: number, sort: string, page: number, filter: any, sortField: string }) {
        const skip = (page - 1) * limit;
        let sortBy: { [key: string]: SortOrder } = {};
        if (sortField === 'price') {
            sortBy = { price: sort === 'desc' ? -1 : 1 };
        } else if (sortField === 'name') {
            sortBy = { productName: sort === 'desc' ? -1 : 1 };
        } else if (sortField === 'ctime') {
            sortBy = { createdAt: sort === 'desc' ? -1 : 1 };
        }

        const filterQuery = {
            ...filter,
            isPublish: true,
        };

        const products = await ProductModel.find(filterQuery)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .lean();

        const productsWithVariants = await Promise.all(
            products.map(async product => {
                const variants = await VariantModel.find({ productId: product._id, isPublish: true })
                    .populate('attributes.value')
                    .exec();
                return {
                    ...product,
                    variants
                };
            })
        );

        return productsWithVariants;
    }

    // get detail
    static async getProductWithVariantsAndAttributes(productId: string) {
        const product = await ProductModel.findById({ _id: productId }).exec();
        if (!product) {
            throw new AppError(StatusCodes.NOT_FOUND, `Product not found`);
        };

        const variants = await VariantModel.find({ productId }).populate('attributes.value').exec();
        return {
            product,
            variants
        };
    }

    //get all
    static async getAllProduct({ limit, sort, page, filter, sortField }:
        { limit: number, sort: string, page: number, filter: any, sortField: string }) {
        const skip = (page - 1) * limit;
        let sortBy: { [key: string]: SortOrder } = {};
        if (sortField === 'price') {
            sortBy = { price: sort === 'desc' ? -1 : 1 };
        } else if (sortField === 'name') {
            sortBy = { productName: sort === 'desc' ? -1 : 1 };
        } else if (sortField === 'ctime') {
            sortBy = { createdAt: sort === 'desc' ? -1 : 1 };
        }

        const products = await ProductModel.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .lean();

        const productsWithVariants = await Promise.all(
            products.map(async product => {
                const variants = await VariantModel.find({ productId: product._id })
                    .populate('attributes.value')
                    .exec();
                return {
                    ...product,
                    variants
                };
            })
        );
        return productsWithVariants;
    }

    //Publish by shop
    static async publicProductByShop(productIds: string[]) {
        const validProductIds = productIds.map(id => new Types.ObjectId(id));

        const foundProducts = await ProductModel.find({
            _id: { $in: validProductIds },
            isPublish: false
        });

        if (foundProducts.length === 0) {
            throw new AppError(StatusCodes.NOT_FOUND, `No products found or already published`);
        }

        const updateResult = await ProductModel.updateMany(
            { _id: { $in: validProductIds }, isPublish: false },
            { $set: { isPublish: true } }
        );
        productIds.map(productId => {
            ElasticService.updateProduct({ productId, isPublish: true })
        })
        return {
            success: true,
            message: `${updateResult.modifiedCount} products published successfully`,
        };
    }

    static async unPublicProductByShop(productIds: string[]) {
        const validProductIds = productIds.map(id => new Types.ObjectId(id));

        const foundProducts = await ProductModel.find({
            _id: { $in: validProductIds },
            isPublish: true
        });

        if (foundProducts.length === 0) {
            throw new AppError(StatusCodes.NOT_FOUND, `No products found or already unpublished`);
        }

        const updateResult = await ProductModel.updateMany(
            { _id: { $in: validProductIds }, isPublish: true },
            { $set: { isPublish: false } }
        );

        productIds.map(productId => {
            ElasticService.updateProduct({ productId, isPublish: false })
        })

        return {
            success: true,
            message: `${updateResult.modifiedCount} products unpublished successfully`,
        };
    }

    //update
    static async updateProduct({ productId, payload }: { productId: string, payload: Partial<IProduct> }) {
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            { $set: payload },
            { new: true, lean: true }
        )
        if (!updatedProduct) {
            throw { statusCode: StatusCodes.NOT_FOUND, message: 'Product not found.' };
        }

        await ElasticService.updateProduct({ productId, ...payload })
        return updatedProduct
    }



    //delete
    static async deleteProduct(productIds: string[]) {
        const deletedProducts = await ProductModel.deleteMany({ _id: { $in: productIds } });

        const deletedVariants = await VariantModel.deleteMany({ productId: { $in: productIds } });

        productIds.map(productId => {
            ElasticService.deleteProduct(productId)
        })
        return {
            deletedProducts,
            deletedVariants,
        };
    }

    //search
    static async searchProduct(keySearch: any) {
        return await ElasticService.searchProduct(keySearch)
    }

}